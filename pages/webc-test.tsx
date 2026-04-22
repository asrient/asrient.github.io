import Head from 'next/head'
import { useCallback, useRef, useState } from 'react'
import { getDefaultStaticProps } from '../lib/utils'

const STUN_SERVERS = [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302',
    'stun:stun.cloudflare.com:3478',
];

type Candidate = {
    type: string;
    protocol: string;
    address: string;
    port: number;
    relatedAddress: string | null;
    relatedPort: number | null;
};

type LogEntry = {
    text: string;
    level: 'info' | 'pass' | 'fail' | 'warn';
};

type Verdict = {
    text: string;
    level: 'ok' | 'bad' | 'maybe';
};

type Section = {
    heading: string;
    logs: LogEntry[];
    verdict?: Verdict;
};

function gatherCandidates(): Promise<Candidate[]> {
    return new Promise((resolve) => {
        const candidates: Candidate[] = [];
        const pc = new RTCPeerConnection({
            iceServers: STUN_SERVERS.map(url => ({ urls: url })),
        });
        pc.createDataChannel('test');

        const timeout = setTimeout(() => {
            pc.close();
            resolve(candidates);
        }, 10000);

        pc.onicecandidate = (event) => {
            if (!event.candidate) {
                clearTimeout(timeout);
                pc.close();
                resolve(candidates);
                return;
            }
            const c = event.candidate;
            if (c.candidate && c.address) {
                candidates.push({
                    type: c.type,
                    protocol: c.protocol,
                    address: c.address,
                    port: c.port,
                    relatedAddress: c.relatedAddress,
                    relatedPort: c.relatedPort,
                });
            }
        };

        pc.createOffer().then(offer => pc.setLocalDescription(offer));
    });
}

type SrflxResult = {
    address: string;
    port: number;
    relatedAddress: string | null;
    relatedPort: number | null;
} | null;

function gatherSrflxFromServer(stunUrl: string): Promise<SrflxResult> {
    return new Promise((resolve) => {
        let resolved = false;
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: stunUrl }],
        });
        pc.createDataChannel('test');

        const timeout = setTimeout(() => {
            pc.close();
            resolve(null);
        }, 8000);

        pc.onicecandidate = (event) => {
            if (!event.candidate) {
                clearTimeout(timeout);
                pc.close();
                if (!resolved) resolve(null);
                return;
            }
            const c = event.candidate;
            if (c.type === 'srflx' && c.protocol === 'udp') {
                resolved = true;
                clearTimeout(timeout);
                pc.close();
                resolve({
                    address: c.address,
                    port: c.port,
                    relatedAddress: c.relatedAddress,
                    relatedPort: c.relatedPort,
                });
            }
        };

        pc.createOffer().then(offer => pc.setLocalDescription(offer));
    });
}

const borderColors = {
    info: 'border-blue-500',
    pass: 'border-green-500',
    fail: 'border-red-500',
    warn: 'border-yellow-500',
};

const verdictStyles = {
    ok: 'bg-green-900/40 border-green-500',
    bad: 'bg-red-900/40 border-red-500',
    maybe: 'bg-yellow-900/40 border-yellow-500',
};

function LogLine({ entry }: { entry: LogEntry }) {
    return (
        <div className={`bg-gray-800/60 rounded-lg px-3 py-2 my-1.5 font-mono text-sm break-all border-l-4 ${borderColors[entry.level]}`}>
            {entry.text}
        </div>
    );
}

function SectionBlock({ section }: { section: Section }) {
    return (
        <div className="mt-6">
            <h3 className="text-base font-semibold text-blue-300 mb-2">{section.heading}</h3>
            {section.logs.map((entry, i) => (
                <LogLine key={i} entry={entry} />
            ))}
            {section.verdict && (
                <div className={`text-base p-4 mt-3 rounded-lg border ${verdictStyles[section.verdict.level]}`}>
                    {section.verdict.text}
                </div>
            )}
        </div>
    );
}

export default function WebcTest() {
    const [sections, setSections] = useState<Section[]>([]);
    const [running, setRunning] = useState(false);
    const sectionsRef = useRef<Section[]>([]);

    const flush = useCallback(() => {
        setSections([...sectionsRef.current]);
    }, []);

    const addSection = useCallback((heading: string) => {
        sectionsRef.current.push({ heading, logs: [] });
        flush();
    }, [flush]);

    const log = useCallback((text: string, level: LogEntry['level'] = 'info') => {
        const current = sectionsRef.current[sectionsRef.current.length - 1];
        if (current) {
            current.logs.push({ text, level });
            flush();
        }
    }, [flush]);

    const setVerdict = useCallback((text: string, level: Verdict['level']) => {
        const current = sectionsRef.current[sectionsRef.current.length - 1];
        if (current) {
            current.verdict = { text, level };
            flush();
        }
    }, [flush]);

    const runTest = useCallback(async () => {
        setRunning(true);
        sectionsRef.current = [];
        setSections([]);

        // Step 1: gather candidates
        addSection('1. Gathering ICE Candidates');
        log('Using STUN servers to discover public IP and NAT behavior...');

        const candidates = await gatherCandidates();
        const hostCandidates = candidates.filter(c => c.type === 'host');
        const srflxCandidates = candidates.filter(c => c.type === 'srflx');

        // Step 2: host candidates
        addSection('2. Host Candidates (Local IPs)');
        if (hostCandidates.length === 0) {
            log('No host candidates found.', 'warn');
        }
        for (const c of hostCandidates) {
            log(`${c.protocol.toUpperCase()} ${c.address}:${c.port}`, 'info');
        }

        // Step 3: server reflexive
        addSection('3. Server Reflexive Candidates (Public IP via STUN)');
        if (srflxCandidates.length === 0) {
            log('No srflx candidates - UDP may be blocked by this network!', 'fail');
        }
        for (const c of srflxCandidates) {
            log(`${c.protocol.toUpperCase()} ${c.address}:${c.port} (related: ${c.relatedAddress}:${c.relatedPort})`, 'pass');
        }

        // Step 4: NAT analysis
        addSection('4. NAT Type Analysis');
        analyzeNat(hostCandidates, srflxCandidates, log, setVerdict);

        // Step 5: symmetry test
        addSection('5. Multi-Port NAT Symmetry Test');
        await runSymmetryTest(log, setVerdict);

        setRunning(false);
    }, [addSection, log, setVerdict]);

    return (
        <>
            <Head>
                <title>WebConnect Network Test - HomeCloud</title>
            </Head>
            <div className="max-w-xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold mb-1">HomeCloud Network Diagnostic</h1>
                <p className="text-gray-400 mb-6">
                    Tests whether this network supports WebConnect remote connections.
                </p>
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={runTest}
                        disabled={running}
                        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                    >
                        {running ? 'Running...' : 'Run Diagnostic'}
                    </button>
                    {sections.length > 0 && !running && (
                        <button
                            onClick={() => { sectionsRef.current = []; setSections([]); }}
                            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
                {sections.map((section, i) => (
                    <SectionBlock key={i} section={section} />
                ))}
            </div>
        </>
    );
}

function analyzeNat(
    hostCandidates: Candidate[],
    srflxCandidates: Candidate[],
    log: (text: string, level: LogEntry['level']) => void,
    setVerdict: (text: string, level: Verdict['level']) => void,
) {
    if (srflxCandidates.length === 0) {
        log('Cannot determine NAT type - no STUN responses received. This network likely blocks outbound UDP entirely.', 'fail');
        setVerdict('UDP appears blocked on this network. WebConnect remote connections will not work here.', 'bad');
        return;
    }

    const publicIps = Array.from(new Set(srflxCandidates.map(c => c.address)));
    const localIps = new Set(hostCandidates.map(c => c.address));
    const noNat = publicIps.some(ip => localIps.has(ip));

    if (noNat) {
        log('Public IP matches local IP - no NAT detected (or host is directly on the internet).', 'pass');
        setVerdict('No NAT detected. WebConnect should work fine on this network.', 'ok');
        return;
    }

    const udpSrflx = srflxCandidates.filter(c => c.protocol === 'udp');
    let portPreserved = 0;
    let portChanged = 0;
    for (const c of udpSrflx) {
        if (c.relatedPort && c.port === c.relatedPort) {
            portPreserved++;
        } else if (c.relatedPort) {
            portChanged++;
        }
    }

    log(`Public IPs: ${publicIps.join(', ')}`, 'info');
    log(`Port mapping: ${portPreserved} preserved, ${portChanged} changed`, portChanged > 0 ? 'warn' : 'pass');

    if (portChanged === 0 && portPreserved > 0) {
        log('NAT preserves port numbers - likely Cone NAT (Full Cone, Restricted, or Port-Restricted).', 'pass');
        setVerdict('Compatible NAT detected. WebConnect should work on this network.', 'ok');
    } else if (portChanged > 0) {
        log('NAT changes port numbers - could be Symmetric NAT or port-randomizing NAT. The multi-port test below will confirm.', 'warn');
    }
}

async function runSymmetryTest(
    log: (text: string, level: LogEntry['level']) => void,
    setVerdict: (text: string, level: Verdict['level']) => void,
) {
    log('Creating two connections to different STUN servers to compare mapped ports...', 'info');

    const [r1, r2] = await Promise.all([
        gatherSrflxFromServer('stun:stun.l.google.com:19302'),
        gatherSrflxFromServer('stun:stun.cloudflare.com:3478'),
    ]);

    if (!r1 || !r2) {
        log('Could not get reflexive candidates from both STUN servers.', 'warn');
        setVerdict('Unable to complete symmetry test. UDP may be partially blocked.', 'maybe');
        return;
    }

    log(`STUN server 1 (Google): ${r1.address}:${r1.port} (local port: ${r1.relatedPort})`, 'info');
    log(`STUN server 2 (Cloudflare): ${r2.address}:${r2.port} (local port: ${r2.relatedPort})`, 'info');

    if (r1.port === r2.port) {
        log('Same mapped port for different STUN servers → Endpoint-Independent Mapping (Cone NAT)', 'pass');
        setVerdict('Compatible NAT confirmed. WebConnect should work on this network.', 'ok');
    } else {
        log(`Different mapped ports (${r1.port} vs ${r2.port}) → Endpoint-Dependent Mapping (Symmetric NAT)`, 'fail');
        setVerdict(
            'Symmetric NAT detected. This network assigns different external ports per destination, which prevents WebConnect from establishing direct peer-to-peer connections. Remote devices will not be reachable over WebConnect from this network.',
            'bad',
        );
    }
}

export async function getStaticProps() {
    return {
        props: {
            ...getDefaultStaticProps(),
            theme: 'blue',
        },
    };
}

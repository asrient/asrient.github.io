export function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function themed(theme: string) {
    return (strs: TemplateStringsArray) => {
        return strs[0].split(' ').map(s => {
            let parts = s.split('$');
            if (parts.length === 1) {
                return s;
            }
            parts.push(`-${theme}`);
            if (parts[0].startsWith('dark:')) {
                parts.push('-dark');
            }
            return parts.join('');
        }).join(' ');
    }
}

export function getDefaultStaticProps() {
    return {
        theme: 'orange',
        lastUpdatedOn: new Date().toISOString(),
    }
}

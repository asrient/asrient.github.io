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
        const str = strs[0];
        let isVar = false;
        let newStr = '';
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '$') {
                isVar = true;
            } else if (str[i] === ' ' &&  isVar) {
                isVar = false;
                newStr += `-${theme} `
            }
            else {
                newStr += str[i]
            }
        }
        if (isVar) {
            newStr += `-${theme}`
        }
        return newStr;
    }
}

export function getDefaultStaticProps() {
    return {
        theme: 'orange',
        lastUpdatedOn: new Date().toISOString(),
    }
}

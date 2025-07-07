
const lang = {
    en: {
        coms: 'Components',
        logs: 'Logs',
        watchers: 'Watchers',
    },
    ru: {
        coms: 'Компоненты',
        logs: 'Логи',
        watchers: 'Отслеживание',
    },
}



export default function _(v) {
    let language = navigator.language;//browser language
    let currentLang = lang[language];
    let defaultLang = lang.en;
    if ( currentLang[v] ) {
        return currentLang[v];
    } else if(defaultLang[v]){
        return defaultLang[v];
    } else {
        console.error(`CREATE - "${v}"`);//just strong reminder for me to create var, while i declare, but forgot to add
        return v;
    }
}

// -('com')
console.log('-test com ', _('x'));

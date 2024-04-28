// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================


const getTemplate = (appName: string) => {
    return [
        {
            label: appName,
            submenu: [
                {
                    label: 'About ' + appName,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + appName,
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    role: 'hideothers'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit ' + appName,
                    role: 'quit'
                }
            ]
        }
        
    ]
    
}

export default getTemplate;
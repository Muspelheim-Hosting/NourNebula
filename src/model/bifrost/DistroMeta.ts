import { Distribution } from 'helios-distribution-types'

export interface DistroMeta {

    /**
     * Distribution metadata to be forwarded to the distribution file.
     */
    meta: {
        discord?: Distribution['discord']
        config?: {
            disableExtraMods?: string[]
            themeOverrides?: {
                primaryColor: string | null
                secondaryColor: string | null
                backgrounds: (string | null)[]
                banners: {
                    url: string
                    link: string
                    title: string
                }[]
            }
        }
    }

}

export function getDefaultDistroMeta(): DistroMeta {

    return {

        meta: {
            discord: {
                clientId: '1368305428764561428',
                smallImageText: 'Void Event Launcher',
                smallImageKey: 'nyan-cat'
            },
            config: {
                disableExtraMods: [
                    'mods/**/*.jar'
                ],
                themeOverrides: {
                    primaryColor: null,
                    secondaryColor: null,
                    backgrounds: [
                        null
                    ],
                    banners: [
                        {
                            url: 'https://createacademy.net/images/updateinfo.png',
                            link: 'https://bsky.app/profile/createacademy.net/post/3ljnmhjvans2e',
                            title: 'Update 6 ETA'
                        },
                        {
                            url: 'https://createacademy.net/images/season4.png',
                            link: 'https://x.com/CreateAcademyMC/',
                            title: 'Engineer Journey 4!'
                        }
                    ]
                }
            }
        }
        
    }

}
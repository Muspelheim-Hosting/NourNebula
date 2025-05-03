import { mkdirs, pathExists } from 'fs-extra/esm'
import { readFile, writeFile } from 'fs/promises'
import { SpecModelStructure } from './SpecModelStructure.js'
import { ServerStructure } from './Server.struct.js'
import { join, resolve } from 'path'
import { DistroMeta, getDefaultDistroMeta } from '../../model/bifrost/DistroMeta.js'
import { addSchemaToObject, SchemaTypes } from '../../util/SchemaUtil.js'
import { LoggerUtil } from '../../util/LoggerUtil.js'
import { Server } from 'helios-distribution-types'

interface Distribution {
    version: string
    /**
     * Global settings for Discord Rich Presence.
     */
    discord?: {
        /**
         * Client ID for the Application registered with Discord.
         */
        clientId: string
        /**
         * Tootltip for the smallImageKey.
         */
        smallImageText: string
        /**
         * Name of the uploaded image for the small profile artwork.
         */
        smallImageKey: string
    }
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
    /**
     * Array of server objects.
     */
    servers: Server[]
}

const logger = LoggerUtil.getLogger('DistributionStructure')

export class DistributionStructure implements SpecModelStructure<Distribution> {

    private readonly DISTRO_META_FILE = 'distrometa.json'

    private serverStruct: ServerStructure
    private metaPath: string

    constructor(
        private absoluteRoot: string,
        private baseUrl: string,
        discardOutput: boolean,
        invalidateCache: boolean
    ) {
        this.serverStruct = new ServerStructure(this.absoluteRoot, this.baseUrl, discardOutput, invalidateCache)
        this.metaPath = join(this.absoluteRoot, 'meta')
    }

    public async init(): Promise<void> {
        await mkdirs(this.absoluteRoot)
        await mkdirs(this.metaPath)

        const distroMetaFile = resolve(this.metaPath, this.DISTRO_META_FILE)
        if(await pathExists(distroMetaFile)) {
            logger.warn(`Distro Meta file already exists at ${distroMetaFile}!`)
            logger.warn('If you wish to regenerate this file, you must delete the existing one!')
        } else {
            const distroMeta: DistroMeta = addSchemaToObject(
                getDefaultDistroMeta(),
                SchemaTypes.DistroMetaSchema,
                this.absoluteRoot
            )
            await writeFile(distroMetaFile, JSON.stringify(distroMeta, null, 2))
        }

        await this.serverStruct.init()
    }

    public async getSpecModel(): Promise<Distribution> {

        const distroMeta = JSON.parse(await readFile(resolve(this.metaPath, this.DISTRO_META_FILE), 'utf-8')) as DistroMeta

        return {
            version: '1.2.0',
            ...(distroMeta.meta.discord ? {discord: distroMeta.meta.discord} : {}),
            ...(distroMeta.meta.config ? {config: distroMeta.meta.config} : {}),
            servers: await this.serverStruct.getSpecModel()
        }
    }

}

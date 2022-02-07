import Dummy from './Dummy'
import listDummies from './listDummies'
import createDummy from './createDummy'
import updateDummy from './updateDummy'
import deleteDummy from './deleteDummy'
import getDummyById from './getDummyById'

type AppSyncEvent = {
    info: {
        fieldName: string
    }
    arguments: {
        dummy: Dummy
        id: string
    }
}

export async function handler(
    event: AppSyncEvent
) : Promise<Record<string, unknown>[] | Dummy | string | null | undefined> {
    switch (event.info.fieldName) {
        case 'listDummies':
            return await listDummies()
        case 'createDummy':
            return await createDummy(event.arguments.dummy)
        case 'updateDummy':
            return await updateDummy(event.arguments.dummy)
        case 'deleteDummy':
            return await deleteDummy(event.arguments.id)
        case 'getDummyById':
            return await getDummyById(event.arguments.id)
        default:
            return null
    }
}
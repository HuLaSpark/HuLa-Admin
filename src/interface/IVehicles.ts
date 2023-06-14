interface Vehicles {
    id:number
    licensePlate:string
    brand:string
    model:string
    ownerName:string
    ownerPhone:string
    registration:string
    purchaseDate:string
    engineNumber:string
    frameNumber:string
    vehicleStatus:number
    updateTime:string
}
interface parameter{
    pageNum: number
    pageSize: number
    licensePlate: string
}

interface deleteId {
    id?: number
    ids?: number[]
}

interface value {
    code: string
    data?: any
    msg: string
}

export type {
    Vehicles,deleteId,value,parameter
}

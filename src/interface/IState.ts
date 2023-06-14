interface IState{
    loginInfo: {
        user:{
            id:number
            uid:any
            role:string
        }
        roleName:string
        token:string
        menus:[]
        auths:[{auth:string}]
    },
}
export type {
    IState
}

var historyconfig = [
    {
        name: "index",
        path: "/",
        callbackfunc: "gotoConfig",
        meta: {
            title: ''
        }
    },
    {
        name: "noparam",
        path: "/admin",
        callbackfunc: "gotoConfig",
        meta: {
            title: ''
        }
    },
    {
        name:"admin",
        path:"/admin/:userid/:id",
        callbackfunc:"gotoConfig",
        meta:{
            title:''
        }
    },
    {
        name: "admininfo",
        path: "/admin/info/:userid/:id/view/:vv/:ccc/nihao",
        callbackfunc: "gotoConfig",
        meta: {
            title: ''
        }
    },
    {
        name: "adminadmin",
        path: "/admin/admin/:id/:search",
        callbackfunc: "gotoConfig",
        meta: {
            title: ''
        }
    }
]
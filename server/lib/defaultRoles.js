export const defaultRoles = [
    {
        name: "MANAGER",
        permission: [
            {
                id:'94cbf90a-3a77-4c39-8533-ad7dfb8c05ed',
                name: 'EDIT-TASK'
            },
            {
                id:'4ec58217-7b22-4700-8cf8-cac5cb9ec1b1',
                name: 'VIEW-TASK'
            },
            {
                id:'ebe41278-c234-4241-a96d-ae5ab4ae47d5',
                name: 'CREATE-TASK'
            },
            {
                id:'0656cabb-855c-4637-adb7-347261773271',
                name: 'DELETE-TASK'
            },
            {
                id:'1fe7d389-87e9-46c9-b4ea-099928e19651',
                name: 'VIEW-PROJECT'
            },
            {
                id:'6c595291-4319-4d7f-a1be-2435347742aa',
                name: 'EDIT-PROJECT'
            },
        ]
    },
    {
        name: "MEMBER",
        permission: [
            {
                id:'94cbf90a-3a77-4c39-8533-ad7dfb8c05ed',
                name: 'EDIT-TASK'
            },
            {
                id:'4ec58217-7b22-4700-8cf8-cac5cb9ec1b1',
                name: 'VIEW-TASK'
            },
            {
                id:'1fe7d389-87e9-46c9-b4ea-099928e19651',
                name: 'VIEW-PROJECT'
            },
        ]
    },
    {
        name: "VIEWER",
        permission: [
            {
                id:'1fe7d389-87e9-46c9-b4ea-099928e19651',
                name: 'VIEW-PROJECT'
            },
        ]
    }
]
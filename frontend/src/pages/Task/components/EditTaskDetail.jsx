
export const EditTaskDetail = () => {
    const onSearch = async (query) => {
        try {
            const payload = {
                projectId,
                user: { 
                  OR: [
                    {email:query}, 
                    {firstName:query}, 
                    {lastName: query}
                  ]
                },
                sort: {
                  user: {
                    firstName: 'desc'
                  }
                },
                start: 0,
                limit : 5
            }
            setTimeout(async () =>{
               const response =  await getTeamMembers(payload)
               console.log('Query',response.data.data)
               setQueryUsers(response.data.data)
            },1000)
        } catch (error) {
          setQueryUsers([])
        }
      }
      const handleRemoveUser = async (selectedId) => {
        try {
          const currentMember = task?.task_users?.filter(user => 
            (user.id !== selectedId && ({id: user.id})))
          const payload = {
            task_users : {
              set: currentMember
            }
          }
          const response = await unsubcribeTask(task.project.id, task.id,payload)
          if(response.data.ok){
            showMessage('success', `Success`)
            await fetchTask()
            await fetchLogs()
            setShowAddMember(false)
          }else{
            showMessage('warning', response.data.message)
          }
        }catch(error){
          console.log(error)
          showMessage('warning', error.response.data.message)
        }
      }
  return (
    <Drawer open={drawer} onClose={() => showDrawer(false)} width={600}>
        <div>
          <div className="mt-5">
              <p>Task: <Input onChange={onChangeTaskTitle} style={{color: "black"}} value={task.task} /></p>
              <p>Description: <TextArea onChange={onChangeDescription} style={{color: "black"}} value={task.description} /></p>
          </div>
          <div>
                <RangePicker
                onCalendarChange={handleCalendarChange}
                disabledDate={disabledDate}
                showTime={{
                  hideDisabledOptions: true,
                }}
                format="YYYY-MM-DD hh:mm a"
                style={{ width: "100%" }}
              />  
          </div>
          <Button className="w-full bg-green-500" onClick={handleSaveEdit}>Save</Button>
            {/* <Tooltip className="blue" 
                  title={(!permission.includes("ADD-MEMBER") || (!permission.includes("DELETE-MEMBER"))) && "You need permission"}>
                  <Select 
                    showSearch
                    onSearch={onSearch}
                    onSelect={handleSelect}
                    placeholder="Search Member to add"
                    disabled={!permission.includes("ADD-MEMBER")}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase() || "")
                    }
                    options={queryUsers.map(item => (
                        {
                            value: item.user.id,
                            label: `${item.user.email} ${item.user.firstName} ${item.user.lastName}`
                        }
                    ))}
                  />
                  {permission.includes("VIEW-MEMBER") && <Table 
                    className="border-2 rounded-2xl border-slate-400 p-2"
                    dataSource={task?.task_users.map(user => ({
                    key: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    role: "Test",
                    action: <>{permission.includes("DELETE-MEMBER") && <Button
                      onClick={() => handleRemoveUser(user.id)}
                    >Remove</Button>}</>
                  }))} columns={columns} />}
            </Tooltip> */}
            <Button className="bg-red-500 text-slate-50 hover:scale-110" onClick={handleShowDeleteModal}>Delete Task</Button>
          </div>
        </Drawer>
  )
}

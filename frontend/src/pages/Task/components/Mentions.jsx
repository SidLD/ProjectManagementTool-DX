/* eslint-disable react/prop-types */
import { Button } from 'antd';
import { useState } from 'react'
import { Mention, MentionsInput } from "react-mentions";
import { getTeamMembers } from '../../../lib/api';
export const Mentions = ({hanldeSubmitComment, task}) => {
    const [message, setMessage] = useState("");

    const extractEmails = (text) => {
      const matches = text.match(/\((.*?)\)/g);
      const result = [];
      if (matches) {
          for (let i = 0; i < matches.length; ++i) {
              const match = matches[i];
              result.push(match.substring(1, match.length - 1));  // brackets removing
          }
      }
      return result;
  };

    const handleSubmit = async () => {
      const emails = extractEmails(message)
      let newMessage = message
      emails.map(email => {
        newMessage = newMessage.replace(email, "")
        newMessage = newMessage.replace("(","")
        newMessage = newMessage.replace(")","")
        newMessage = newMessage.replace("]","")
        newMessage = newMessage.replace("[","")
      })
      const isSuccess = await hanldeSubmitComment(newMessage, emails)
      if(isSuccess){
        setMessage("")
      }
    }
    const onChange = (e) => {
        setMessage(e.target.value);
    };
    const fetchMember = (query, callback)  => {
      if (!query) return;
      setTimeout(async () => {
        try {
          const payload = {
              user:{
                OR : [
                  {email: { contains: query}},
                  {firstName: { contains: query}},
                  {lastName: { contains: query}},
                  //This fetch the manager
                  {projects: {
                    some: { id: task.project.id }
                  }}
                ]
              }, 
              projectId: task.project.id
          }
          console.log(payload)
          const response = await getTeamMembers(payload)
          callback(response?.data?.data.map(member => ({
            id: member.user.email, 
            display: `${member.user.firstName} ${member.user.lastName}`
          })))
        } catch (error) {
          callback([])
        }
      },500)
    }
    return (
      <div className="single-line">
        <MentionsInput
          className='w-full bg-slate-100 h-10 rounded-md'
          value={message}
          onChange={onChange}
          placeholder="Add Comment. Use '@' for mention"
          a11ySuggestionsListLabel={"Suggested mentions"}
        >
          <Mention 
            className='p-10'
            data={fetchMember} 
            displayTransform={(id) => `@${id}`}
            trigger="@"
          />
        </MentionsInput>
        <Button className="float-right relative right-0 bottom-8 bg-blue-500 text-white" onClick={handleSubmit}>Send</Button>

      </div>
    );
}
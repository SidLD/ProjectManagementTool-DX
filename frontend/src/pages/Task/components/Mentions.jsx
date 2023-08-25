/* eslint-disable react/prop-types */
import { Button } from 'antd';
import { useState } from 'react'
import { Mention, MentionsInput } from "react-mentions";
import { getTeamMembers } from '../../../lib/api';

export const Mentions = ({hanldeSubmitComment, task}) => {
    const [message, setMessage] = useState("");

    const extractIds = (text) => {
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
      const ids = extractIds(message)
      let newMessage = message
      ids.map(email => {
        newMessage = newMessage.replace(email, "")
        newMessage = newMessage.replace("(","")
        newMessage = newMessage.replace(")","")
        newMessage = newMessage.replace("]","")
        newMessage = newMessage.replace("[","")
      })
      const isSuccess = await hanldeSubmitComment(newMessage, ids)
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
                  {projects: {
                    some: { id: task.project.id }
                  }}
                ]
              }, 
              projectId: task.project.id
          }
          const response = await getTeamMembers(payload)

          callback(response?.data?.data.map(member => ({
            id: member.user.id, 
            display: `${member.user.firstName} ${member.user.lastName}`
          })))
        } catch (error) {
          callback([])
        }
      },500)
    }
    return (
      <div className="single-line rounded-lg border-none">
        <MentionsInput
          className='font-poppins w-full bg-slate-100 h-20 rounded-xl'
          value={message}
          onChange={onChange}
          placeholder=" Write a comment ..."
          a11ySuggestionsListLabel={"Suggested mentions"}
        >
          <Mention 
            className=' border-none'
            data={fetchMember} 
            displayTransform={(id, display) => `@${display}`}
            trigger="@"
          />
        </MentionsInput>
        <Button className="mt-2 mb-0 bg-blue-500 text-white" onClick={handleSubmit}>Send</Button>

      </div>
    );
}
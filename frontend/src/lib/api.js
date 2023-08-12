import axios from "axios";
import { dataHeader } from "./helper";

// START OF USER API
export const register = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/register`, data, dataHeader())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
};
export const login = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/login`, data, dataHeader())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
};
export const getUsers = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// END OF USER API

// START OF PERMISSION API
export const getPermission = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/permission`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getAllPermission = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/permissions`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF PERMISSION API

// START OF ROLE API
export const getRoles = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/role`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export const getUserRole = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/role`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export const createRole = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/project/${projectId}/role`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export const updateRole = (projectId, roleId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/project/${projectId}/role/${roleId}`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const deleteRole = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/project/${projectId}/role`, 
        {
          data, 
          ...dataHeader()
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF ROLE API

// START OF PROJECT API
export const getProjects = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/project`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createProject = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/project`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const deleteProject = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/project`, 
        {
          data, 
          ...dataHeader()
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF PROJECT API

// START OF TASK API
export const getTasks = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/project/${projectId}/task`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getTaskCount = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/count`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getAllTasks = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/project/tasks`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//Array ine
export const createTasks = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/project/${projectId}/task`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const updateTask = (projectId,taskId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/project/${projectId}/task/${taskId}`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const subcribeTask = (projectId,taskId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/project/${projectId}/task/${taskId}/member/subcribe`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const unsubcribeTask = (projectId,taskId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/project/${projectId}/task/${taskId}/member/unsubcribe`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteTask = (projectId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/project/${projectId}/task`, 
        {
          data, 
          ...dataHeader()
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF TASK API

// START OF TEAM MEMBER API
export const getTeamMembers = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/project/member`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createTeamMember = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/project/${projectId}/member`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const updateTeamMember = (projectId,memberId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/project/${projectId}/member/${memberId}`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const deleteTeamMember = (projectId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/project/${projectId}/member`, 
        {
          data, 
          ...dataHeader()
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF TEAM MEMBER API


// START OF LOGS API
export const getLogs = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/log`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF LOGS API

// START OF Comment API
export const createComment = (taskId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/task/${taskId}/comment`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const replyComment = (taskId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/task/${taskId}/comment/reply`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getComment = (taskId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/${taskId}/comment`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getReplyComment = (commentId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/comment/${commentId}/reply`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// END OF LOGS API

//START OF Mention API
export const getMention = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/mention`, 
        {
          params: data,
          ...dataHeader()
        })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//END of Mention API
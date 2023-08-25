import axios from "axios";
import { dataHeader } from "./helper";

// START OF USER API
export const register = (data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/register`, data, dataHeader())
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
        .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/login`, data, dataHeader())
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/users`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/permissions`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/all-permissions`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/roles`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/users/roles`, 
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/roles`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/roles/${roleId}`, data, dataHeader())
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
      .delete(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/roles`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects`, 
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateProject = (projectId, data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}`, data, dataHeader())
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
      .delete(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/counts`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/tasks`, 
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks/${taskId}`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks/${taskId}/members/subcribe`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks/${taskId}/members/unsubcribe`, data, dataHeader())
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
      .delete(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/tasks`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/members`, 
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/members`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/members/${memberId}`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateTeamStatus = (memberId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/members/${memberId}/status`, data, dataHeader())
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
      .delete(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/members`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/logs`, 
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/${taskId}/comments`, data, dataHeader())
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
      .post(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/${taskId}/comments/reply`, data, dataHeader())
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/${taskId}/comments`, 
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
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/tasks/comments/${commentId}/reply`, 
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
export const getNotifications = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/notifications`, 
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

export const updateNotifications = (notificationId,data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/notifications/${notificationId}`, data, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateAllNotifications = () => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_API_VERSION}/all-mentions`, {}, dataHeader())
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//END of Mention API
// import React, { useEffect, useState } from 'react';

// const ProjectView = ({ projectId }) => {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage
//         const response = await fetch(`/api/v1/projects?project_id=${projectId}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           const text = await response.text(); 
//           console.error('Ошибка сервера:', text); 
//           throw new Error(`Ошибка HTTP ${response.status}: ${text.slice(0, 100)}...`);
//         }
        
//         const data = await response.json();
//         if (data.meta.status === 'OK') {
//           setProject(data.data.body);
//         } else {
//           setError('Failed to fetch project data');
//         }
        
//         console.log(response.data);
//       } catch (err) {
//         setError(err.message || 'Error fetching project');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [projectId]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   if (!project) {
//     return <div className="flex justify-center items-center h-screen">Project not found</div>;
//   }

//   return (
//     <div className="project-details container mx-auto p-4">
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="project-main flex-1">
//           <div className="project-section bg-white shadow-md rounded-lg p-6 mb-6">
//             <h3 className="text-xl font-semibold mb-4">Описание проекта</h3>
//             <p className="text-gray-700 mb-4">{project.description}</p>
//             <p className="text-gray-700 font-medium">Основные функции:</p>
//             <ul className="list-disc pl-5 text-gray-700">
//               <li>Учет доходов и расходов по категориям</li>
//               <li>Визуализация данных с помощью графиков и диаграмм</li>
//               <li>Напоминания о регулярных платежах</li>
//               <li>Установка финансовых целей</li>
//               <li>Экспорт данных в CSV и PDF</li>
//             </ul>
//           </div>

//           <div className="project-section bg-white shadow-md rounded-lg p-6">
//             <h3 className="text-xl font-semibold mb-4">Участники проекта</h3>
//             <div className="project-members grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {project.users.map((user) => (
//                 <div key={user.user_id} className="member-card flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
//                   <div className="member-avatar w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mr-4">
//                     {user.nickname ? user.nickname[0] : user.email[0]}
//                   </div>
//                   <div className="member-info">
//                     <h4 className="text-lg font-medium">{user.nickname || user.email}</h4>
//                     <p className="text-gray-600">
//                       {user.role === 3 ? 'Владелец' : user.role === 2 ? 'Администратор' : user.role === 1 ? 'Участник' : 'Заблокирован'}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="project-sidebar w-full md:w-80">
//           <div className="sidebar-section bg-white shadow-md rounded-lg p-6 mb-6">
//             <h3 className="text-xl font-semibold mb-4">Детали проекта</h3>
//             <div className="detail-item flex justify-between">
//               <span className="detail-label font-medium">Статус:</span>
//               <span className="detail-value text-green-600 font-medium">Активный</span>
//             </div>
//             <div className="detail-item flex justify-between">
//               <span className="detail-label font-medium">Создан:</span>
//               <span className="detail-value">{new Date(project.created_at).toLocaleDateString()}</span>
//             </div>
//             <div className="detail-item flex justify-between">
//               <span className="detail-label font-medium">Обновлен:</span>
//               <span className="detail-value">{new Date(project.updated_at).toLocaleDateString()}</span>
//             </div>
//           </div>

//           <div className="sidebar-section bg-white shadow-md rounded-lg p-6">
//             <h3 className="text-xl font-semibold mb-4">Технологии</h3>
//             <div className="tech-tags flex flex-wrap gap-2">
//               {project.tags ? (
//                 project.tags.map((tag) => (
//                   <span key={tag} className="tech-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                     {tag}
//                   </span>
//                 ))
//               ) : (
//                 ['Flutter', 'Dart', 'Firebase', 'Node.js', 'MongoDB'].map((tech) => (
//                   <span key={tech} className="tech-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                     {tech}
//                   </span>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectView;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProjectView = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Токен доступа не найден');
  
        const response = await fetch(`/api/v1/projects?project_id=${parseInt(projectId)}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json', // Explicitly ask for JSON
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error ${response.status}: ${errorText.slice(0, 100)}`);
        }
  
        // Try to parse as JSON regardless of content-type header
        try {
          const data = await response.json();
          console.log('Received data:', data);
          
          if (data?.meta?.status === 'OK' && data?.data?.body) {
            setProject(data.data.body);
          } else {
            throw new Error(data?.meta?.message || 'Неверная структура ответа');
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          const text = await response.text();
          console.error('Actual response text:', text);
          throw new Error('Failed to parse response as JSON');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Ошибка при загрузке проекта');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center h-screen">Проект не найден</div>;
  }

  return (
    <>
    <div className="project-details container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="project-main flex-1">
          <div className="project-section bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Описание проекта</h3>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <p className="text-gray-700 font-medium">Основные функции:</p>
            <ul className="list-disc pl-5 text-gray-700">
              {project.features?.map((feature, index) => (
                <li key={index}>{feature}</li>
              )) || <li>Функции не указаны</li>}
            </ul>
          </div>

          <div className="project-section bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Участники проекта</h3>
            <div className="project-members grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.users.map((user) => (
                <div key={user.user_id} className="member-card flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="member-avatar w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mr-4">
                    {user.nickname ? user.nickname[0] : user.email[0]}
                  </div>
                  <div className="member-info">
                    <h4 className="text-lg font-medium">{user.nickname || user.email}</h4>
                    <p className="text-gray-600">
                      {user.role === 3 ? 'Владелец' : user.role === 2 ? 'Администратор' : user.role === 1 ? 'Участник' : 'Заблокирован'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="project-sidebar w-full md:w-80">
          <div className="sidebar-section bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Детали проекта</h3>
            <div className="detail-item flex justify-between">
              <span className="detail-label font-medium">Статус:</span>
              <span className={`detail-value font-medium ${project.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {project.status === 'active' ? 'Активный' : 'Неактивный'}
              </span>
            </div>
            <div className="detail-item flex justify-between">
              <span className="detail-label font-medium">Создан:</span>
              <span className="detail-value">{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="detail-item flex justify-between">
              <span className="detail-label font-medium">Обновлен:</span>
              <span className="detail-value">{new Date(project.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="sidebar-section bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Технологии</h3>
            <div className="tech-tags flex flex-wrap gap-2">
              {project.tags?.length > 0 ? (
                project.tags.map((tag) => (
                  <span key={tag} className="tech-tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Технологии не указаны</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectView;

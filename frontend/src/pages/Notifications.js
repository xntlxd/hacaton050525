import React, { useState, useEffect } from 'react';
import "../style/style.css";
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            console.log(localStorage);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            console.log(2);
            const response = await fetch('http://localhost:5000/api/v1/notification', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(3);

            const data = await response.json();
            setNotifications(data.data.body || []);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
            setLoading(false);
        }
    };

    
    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('accessToken');;
            const response = await fetch('http://localhost:5000/api/v1/notification', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notification_id: notificationId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, checked: true } : notif
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('accessToken');;
            const unreadNotifications = notifications.filter(notif => !notif.checked);

            await Promise.all(
                unreadNotifications.map(notif =>
                    fetch('http://localhost:5000/api/v1/notification', {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ notification_id: notif.id }),
                    }).then(res => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                    })
                )
            );

            setNotifications(prev =>
                prev.map(notif => ({ ...notif, checked: true }))
            );
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleTypeFilter = (type) => {
        setTypeFilter(type);
        setCurrentPage(1);
    };

    const filteredNotifications = notifications.filter(notif => {
        const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notif.checked);
        const matchesType = typeFilter === 'all' || notif.type === typeFilter;
        return matchesTab && matchesType;
    });

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(
        indexOfFirstNotification,
        indexOfLastNotification
    );

    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const unreadCount = notifications.filter(notif => !notif.checked).length;

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds} секунд назад`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} минут назад`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} часов назад`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} дней назад`;
        return `${Math.floor(days / 7)} недель назад`;
    };

    const NotificationItem = ({ notification }) => {
        const getInitial = () => {
            return notification.text.charAt(0).toUpperCase();
        };

        return (
            <motion.div
                className={`notification-item ${notification.checked ? '' : 'unread'}`}
                onClick={() => !notification.checked && markAsRead(notification.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="notification-avatar">
                    {getInitial()}
                </div>
                <div className="notification-content">
                    <div className="notification-message">
                        {notification.text}
                    </div>
                    <div className="notification-meta">
                        <span className="notification-type">{notification.type || 'Уведомление'}</span>
                        <span className="notification-time">
                            {formatTimeAgo(notification.created_at)}
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    };

    

    if (loading) {
        return <div className="loading">Загрузка уведомлений...</div>;
    }

    if (error) {
        return <div className="error">Ошибка: {error}</div>;
    }

    return (
        <>
        <Sidebar />
        <div className="dashboard">
            <main className="main-content">
                <div className="notifications-container">
                    <div className="notifications-header">
                        <div className="notifications-title">
                            <h1>Уведомления</h1>
                            {unreadCount > 0 && (
                                <span className="unread-badge">{unreadCount}</span>
                            )}
                        </div>
                        <div className="notifications-actions">
                            <button className="mark-all-read" onClick={markAllAsRead}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18 8L22 12L18 16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M6 8L2 12L6 16"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 12H22"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Прочитать все
                            </button>
                        </div>
                    </div>

                    <div className="notification-tabs">
                        <div
                            className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => handleTabClick('all')}
                        >
                            Все
                        </div>
                        <div
                            className={`notification-tab ${activeTab === 'unread' ? 'active' : ''}`}
                            onClick={() => handleTabClick('unread')}
                        >
                            Непрочитанные{' '}
                            {unreadCount > 0 && (
                                <span className="notification-tab-badge">{unreadCount}</span>
                            )}
                        </div>
                    </div>

                    <div className="notification-filters">
                        <button
                            className={`notification-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleTypeFilter('all')}
                        >
                            Все типы
                        </button>
                        <button
                            className={`notification-filter-btn ${typeFilter === 'project' ? 'active' : ''}`}
                            onClick={() => handleTypeFilter('project')}
                        >
                            Проекты
                        </button>
                        <button
                            className={`notification-filter-btn ${typeFilter === 'task' ? 'active' : ''}`}
                            onClick={() => handleTypeFilter('task')}
                        >
                            Задачи
                        </button>
                        <button
                            className={`notification-filter-btn ${typeFilter === 'message' ? 'active' : ''}`}
                            onClick={() => handleTypeFilter('message')}
                        >
                            Сообщения
                        </button>
                    </div>

                    <div className="notification-list">
                        <AnimatePresence>
                            {currentNotifications.length === 0 ? (
                                <div className="empty-notifications">
                                    Нет уведомлений
                                </div>
                            ) : (
                                currentNotifications.map(notification => (
                                    <NotificationItem 
                                        key={notification.id} 
                                        notification={notification} 
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    className={`page-link ${currentPage === number ? 'active' : ''}`}
                                    onClick={() => paginate(number)}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
        </>
    );
};

export default Notifications;
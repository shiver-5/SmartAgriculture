import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = (p0?: { page: number; size: number; name: string; }) => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

export const fetchCaseData = () => {
    return request({
        url: './mock/case.json',
        method: 'get'
    });
};

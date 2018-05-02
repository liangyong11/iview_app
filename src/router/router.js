import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => {
        require(['@/views/login.vue'], resolve);
    }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => {
        require(['@/views/error-page/404.vue'], resolve);
    }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => {
        require(['@//views/error-page/403.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => {
        require(['@/views/error-page/500.vue'], resolve);
    }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    title: 'Home',
    component: Main,
    children: [
        {
            path: 'home',
            title: {i18n: 'home'},
            name: 'home_index',
            component: resolve => {
                require(['@/views/home/home.vue'], resolve);
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/chart',
        icon: 'ios-folder',
        name: 'chart',
        title: '可视化图表',
        component: Main,
        children: [
            {
                path: 'bar',
                icon: 'ios-paper-outline',
                name: 'bar',
                title: '柱状图',
                component: resolve => {
                    require(['@/views/chart/bar/bar.vue'], resolve);
                }
            },
            {
                path: 'pie',
                icon: 'ios-paper-outline',
                name: 'pie',
                title: '饼图',
                component: resolve => {
                    require(['@/views/chart/pie/pie.vue'], resolve);
                }
            },
            {
                path: 'ring',
                icon: 'ios-paper-outline',
                name: 'ring',
                title: '环状图',
                component: resolve => {
                    require(['@/views/chart/ring/ring.vue'], resolve);
                }
            },
            {
                path: 'groupbar',
                icon: 'ios-paper-outline',
                name: 'groupbar',
                title: '柱状组合图',
                component: resolve => {
                    require(['@/views/chart/groupbar/groupbar.vue'], resolve);
                }
            },
            {
                path: 'stack',
                icon: 'ios-paper-outline',
                name: 'stack',
                title: '堆栈图',
                component: resolve => {
                    require(['@/views/chart/stack/stack.vue'], resolve);
                }
            },
            {
                path: 'radialstack',
                icon: 'ios-paper-outline',
                name: 'radialstack',
                title: '径向堆栈图',
                component: resolve => {
                    require(['@/views/chart/radialstack/radialstack.vue'], resolve);
                }
            },
            {
                path: 'chord',
                icon: 'ios-paper-outline',
                name: 'chord',
                title: '弦图',
                component: resolve => {
                    require(['@/views/chart/chord/chord.vue'], resolve);
                }
            },
            {
                path: 'radar',
                icon: 'ios-paper-outline',
                name: 'radar',
                title: '雷达图',
                component: resolve => {
                    require(['@/views/chart/radar/radar.vue'], resolve);
                }
            },
            {
                path: 'area',
                icon: 'ios-paper-outline',
                name: 'area',
                title: '面积图',
                component: resolve => {
                    require(['@/views/chart/area/area.vue'], resolve);
                }
            },
            {
                path: 'sankey',
                icon: 'ios-paper-outline',
                name: 'sankey',
                title: '桑基图',
                component: resolve => {
                    require(['@/views/chart/sankey/sankey.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/application',
        icon: 'ios-folder',
        name: 'application',
        title: '关系图',
        component: Main,
        children: [
            {
                path: 'family',
                icon: 'ios-paper-outline',
                name: 'family',
                title: '家族结构图',
                component: resolve => {
                    require(['@/views/application/family_relation/family.vue'], resolve);
                }
            },
            {
                path: 'society',
                icon: 'ios-list-outline',
                name: 'society',
                title: '社会关系图',
                component: resolve => {
                    require(['@/views/application/society_relation/society.vue'], resolve);
                }
            },
            {
                path: 'topo',
                icon: 'ios-list-outline',
                name: 'topo',
                title: '拓扑关系图',
                component: resolve => {
                    require(['@/views/application/topo/topo.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/threed',
        icon: 'ios-folder',
        name: 'threed',
        title: '三维效果',
        component: Main,
        children: [
            {
                path: 'threechart',
                icon: 'ios-paper-outline',
                name: 'threechart',
                title: '三维图表',
                component: resolve => {
                    require(['@/views/threed/threechart/threechart.vue'], resolve);
                }
            },
            {
                path: 'globe',
                icon: 'ios-list-outline',
                name: 'globe',
                title: '三维粒子效果',
                component: resolve => {
                    require(['@/views/threed/globe/globe.vue'], resolve);
                }
            }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];

<template>
    <div id="app">
        <div id="nav">
            <el-menu default-active="/"
                     class="el-menu-vertical-demo"
                     :collapse="isCollapse"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b"
                     @select="changeMenu"
                     router>
                <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.path">
                    <i :class="item.icon"></i>
                    <span slot="title">{{ item.title }}</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="right">
            <div class="top-bar">
                <el-button type="text" @click="fold">
                    <i :class="[isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold']"></i>
                </el-button>
                {{ navTitle }}
            </div>
            <div class="content">
                <router-view/>
            </div>
        </div>
    </div>
</template>


<script>

    export default {
        data() {
            return {
                isCollapse: false,
                navTitle: '收支记录',
                menuList: [{
                    title: '收支记录',
                    path: '/',
                    icon: 'el-icon-menu'
                }, {
                    title: '统计表',
                    path: '/table',
                    icon: 'el-icon-s-data'
                }]
            }
        },
        methods: {
            fold() {
                this.isCollapse = !this.isCollapse;
            },
            changeMenu(index) {
                this.menuList.forEach(item => {
                    if (item.path === index) {
                        this.navTitle = item.title;
                    }
                })
            }
        }
    }
</script>

<style>
    html, body {
        height: 100%;
    }

    body, div {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%
    }

    #nav {
        float: left;
        text-align: left;
        height: 100%;
    }

    .right {
        overflow: hidden;
        height: 100%;
    }

    .right .content {
        padding: 20px;
        height: 90%;
        overflow: scroll;
    }

    .right .top-bar {
        min-height: 50px;
        height: 4%;
        border-bottom: 1px solid #e6e6e6;
        box-shadow: 0px 0px 8px 0px #ccc;
        line-height: 50px;
    }

    .top-bar i {
        font-size: 25px;
    }

    .top-bar .el-button {
        float: left;
        margin-left: 10px;
    }

    .el-menu-vertical-demo {
        width: 200px;
        height: 100%;
    }
</style>

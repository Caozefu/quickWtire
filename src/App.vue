<template>
    <div id="app">
        <div id="nav">
            <el-menu default-active="/"
                     class="el-menu-vertical-demo"
                     :collapse="isCollapse"
                     background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b"
                     router>
                <el-menu-item index="/">
                    <i class="el-icon-menu"></i>
                    <span slot="title">收支记录</span>
                </el-menu-item>
                <el-menu-item index="/table">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="right">
            <div class="top-bar">
                <el-button type="text" @click="fold">
                    <i :class="[isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold']"></i>
                </el-button>
                收支记录
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
                isCollapse: false
            }
        },
        methods: {
            fold() {
                this.isCollapse = !this.isCollapse;
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

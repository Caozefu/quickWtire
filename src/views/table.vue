<template>
    <div class="table" style="text-align: left">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="日期范围">
                <el-date-picker
                        v-model="formInline.date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="排序方式">
                <el-select v-model="formInline.sort" clearable placeholder="默认">
                    <el-option label="收入最高" value="inCount"></el-option>
                    <el-option label="支出最高" value="outCount"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-card class="box-card">
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        label="日期"
                        width="200">
                    <template slot-scope="scope">
                        {{ formatDate(scope.row.date) }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="收入总额">
                    <template slot-scope="scope">
                        <span style="line-height: 32px">{{ scope.row.inCount }}</span>
                        <el-button type="text"
                                   size="small"
                                   @click="getIncountDetail(scope.row)"
                                   style="float: right; margin-right: 30px">查看收入明细>></el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        label="支出总额">
                    <template slot-scope="scope">
                        <span style="line-height: 32px">{{ scope.row.outCount }}</span>
                        <el-button type="text"
                                   size="small"
                                   @click="getOutcountDetail(scope.row)"
                                   style="float: right;">查看支出明细>></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog title="收入详情" width="500px" :visible.sync="incountDetailVisible">
            <div>
                <span class="title">日 期</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ getDate }}</span>
            </div>
            <el-divider></el-divider>
            <div class="dialog-content" v-if="currentRow && currentRow.inCountList">
                <div>
                    <span class="title">微信收入</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ getMoney('wx') }}</span>
                </div>
                <div>
                    <span class="title">支付宝收入</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ getMoney('alipay') }}</span>
                </div>
                <div>
                    <span class="title">现金收入</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ getMoney('count') }}</span>
                </div>
                <div>
                    <span class="title">饿了么</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ getMoney('eleme') }}</span>
                </div>
                <div>
                    <span class="title">美团</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ getMoney('meituan') }}</span>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="支出详情" width="500px" :visible.sync="outcountDetailVisible">
            <div>
                <span class="title">日 期</span>
                <el-divider direction="vertical"></el-divider>
                <span>{{ getDate }}</span>
            </div>
            <el-divider></el-divider>
            <div class="out-dialog-content" v-if="currentRow && currentRow.outCountList">
                <div v-for="(item, index) in currentRow.outCountList" :key="index">
                    <span>No.{{index + 1}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="title">{{ item.name }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i>¥</i>{{ formatMoney(item.outCount) }}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "table",
        data() {
            return {
                formInline: {
                    date: '',
                    sort: ''
                },
                tableData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                incountDetailVisible: false,
                outcountDetailVisible: false,
                currentRow: {}
            }
        },
        computed: {
            getDate() {
                if (this.currentRow && this.currentRow.date) {
                    return this.formatDate(this.currentRow.date);
                } else {
                    return ''
                }
            }
        },
        methods: {
            // 获取存储的数据
            getStorage() {
                // let data = [];
                this.$http.get('/api/getTotalItems?sortType=1').then(res => {
                    this.tableData = res.data.data;
                })
                // this.sortTable(data, 'date', 1);
                // this.tableData = data;
            },
            /*
            * @params data: 待处理数据
            * @params attr: 待排序属性
            * @params type: 0： 降序, 1： 升序
            * */
            sortTable(data, attr, type) {
                if (!data) return;
                data.sort((item1, item2) => {
                    let date1, date2;
                    if (attr === 'date') {
                        date1 = new Date(item1.date).getTime();
                        date2 = new Date(item2.date).getTime();
                    } else {
                        date1 = parseFloat(item1[attr]);
                        date2 = parseFloat(item2[attr]);
                    }
                    if (date1 < date2) {
                        return type ? -1 : 1
                    } else {
                        return type ? 1 : -1
                    }
                })
            },
            search() {
                if (!this.formInline.sort) return;
                if (this.formInline.sort === 'inCount') {
                    this.sortTable(this.tableData, 'inCount', 0)
                } else {
                    this.sortTable(this.tableData, 'outCount', 0)
                }
            },
            getIncountDetail(row) {
                this.currentRow = row;
                this.incountDetailVisible = true;
            },
            getOutcountDetail(row) {
                this.currentRow = row;
                this.outcountDetailVisible = true;
            },
            getMoney(item) {
                if (parseFloat(this.currentRow.inCountList[item])) {
                    return parseFloat(this.currentRow.inCountList[item]).toFixed(2) || '0.00'
                } else {
                    return '0.00'
                }
            },
            // 格式化金额
            formatMoney(value) {
                if (typeof value === 'number') {
                    return value.toFixed(2) || '0.00'
                } else {
                    return value ? parseFloat(value).toFixed(2) : '0.00'
                }
            },
            formatDate(timestamp) {
                const year = new Date(timestamp).getFullYear();
                let month = new Date(timestamp).getMonth() + 1;
                month = month >= 10 ? month : '0' + month;
                let date = new Date(timestamp).getDate();
                date = date >= 10 ? date : '0' + date;
                return `${year}-${month}-${date}`;
            }
        },
        mounted() {
            this.getStorage();
        }
    }
</script>

<style lang="less" scoped>
    .table {
        .el-form-item {
            margin-right: 30px;
        }
    }
    .dialog-content, .out-dialog-content {
        & > div {
            padding: 10px 0;
            display: flex;
            align-items: center;
            span:last-child {
                padding-left: 10px;
                color: #dd8a22;
                font-weight: 500;
                & > i {
                    font-style: normal;
                    font-weight: 700;
                    padding-right: 5px;
                }
            }
        }
    }
    .out-dialog-content>div span:last-child {
        color: #ff3131;
    }
    .title {
        display: inline-block;
        width: 80px;
        font-weight: 600;
        white-space: nowrap;
        overflow-x: scroll;
    }
</style>

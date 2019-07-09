<template>
    <div class="home">
        <el-form style="padding: 10px">
            <el-form-item label="选择日期">
                <el-col :span="11">
                    <el-form-item prop="date1">
                        <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"
                                        v-model="date"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form-item>
        </el-form>

        <el-divider>收入统计</el-divider>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="微信">
                <el-input v-model="form.wx" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item label="支付宝">
                <el-input v-model="form.alipay" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item label="现金">
                <el-input v-model="form.count" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item label="美团">
                <el-input v-model="form.meituan" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item label="饿了么">
                <el-input v-model="form.eleme" type="number" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-col :offset="19" :span="5">
                    <div>合计：{{result}} 元</div>
                    <el-button type="primary" size="small" @click="save">保存</el-button>
                    <el-button type="success" size="small" @click="resetForm">重置</el-button>
                </el-col>
            </el-form-item>
        </el-form>
        <el-divider>支出统计</el-divider>
        <el-form ref="form" :model="outObj" label-width="120px">
            <el-form-item v-for="(item, index) in out" :label="`支出项目No.${(index+ 1)}`" :key="index">
                <el-col class="line" :span="2">支出名称：</el-col>
                <el-col :span="8">
                    <el-input v-model="item['name']" clearable placeholder="选填"></el-input>
                </el-col>
                <el-col :span="2">费用：</el-col>
                <el-col :span="11">
                    <el-input v-model="item['outCount']" type="number" clearable></el-input>
                </el-col>
                <el-col :span="1">
                    <el-button type="danger" icon="el-icon-delete" circle size="small"
                               @click="deleteOutItem(item['index'])"></el-button>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-col :offset="18" :span="6">
                    <div>合计：{{outResult()}} 元</div>
                    <el-button type="success" class="el-icon-plus" circle size="small" @click="addOutItem"></el-button>
                    <el-button type="primary" size="small" @click="save">保存</el-button>
                    <el-button type="success" size="small" @click="resetForm">重置</el-button>
                </el-col>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'home',
        data() {
            return {
                form: {
                    wx: '',
                    alipay: '',
                    count: '',
                    meituan: '',
                    eleme: ''
                },
                outNum: 1,
                out: [
                    {
                        'index': 0,
                        'name': '',
                        'outCount': ''
                    }
                ],
                outObj: {},
                temp: {
                    index: 0,
                    name: '',
                    outCount: ''
                },
                date: ''
            }
        },
        computed: {
            result() {
                return parseInt(this.form.wx || 0) + parseInt(this.form.alipay || 0) + parseInt(this.form.count || 0) + parseInt(this.form.meituan || 0) + parseInt(this.form.eleme || 0);
            }
        },
        watch: {
            outNum(val) {
                console.log(val);
            },
            date() {
                this.refreshData();
            }
        },
        methods: {
            addOutItem() {
                this.temp.index++;
                this.out.push(JSON.parse(JSON.stringify(this.temp)));
            },
            save() {
                let json = {
                    'date': this.date,
                    'inCountList': this.form,
                    'inCount': this.result,
                    'outCountList': this.out
                };
                try {
                    let res = JSON.stringify(json);
                    let key = this.date.getFullYear() + ',' + (this.date.getMonth() + 1) + ',' + this.date.getDate();
                    localStorage.setItem(key, res);
                } catch (e) {
                    this.$message.error('保存失败!');
                }
                this.$message.success('保存成功!');
            },
            refreshData() {
                let s = this.date.getFullYear() + ',' + (this.date.getMonth() + 1) + ',' + this.date.getDate();
                if (localStorage.getItem(s)) {
                    this.form = JSON.parse(localStorage.getItem(s)).inCountList;
                    this.out = JSON.parse(localStorage.getItem(s)).outCountList;
                } else {
                    this.resetForm();
                }
            },
            resetForm() {
                this.form = {
                    wx: '',
                    alipay: '',
                    count: '',
                    meituan: '',
                    eleme: ''
                };
                this.out = [
                    {
                        'index': 0,
                        'name': '',
                        'outCount': ''
                    }
                ];
                this.temp = {
                    index: 0,
                    name: '',
                    outCount: ''
                }
            },
            deleteOutItem(index) {
                this.out.forEach((val, i) => {
                    if (index == val.index) {
                        this.out.splice(i, 1);
                    }
                });
            },
            outResult() {
                let count = 0;
                this.out.forEach(val => {
                    count += parseInt(val.outCount || 0);
                });
                return count;
            }
        },
        mounted() {
            this.date = new Date();
            this.refreshData();
        }
    }
</script>

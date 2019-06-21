<template>
<div>
    chart1
</div>    
</template>

<script>
export default {
    name :  'chart1',
    data(){return {
        type : '1'
    }},
    created(){
        this.init();
    },
    methods:{
        init(){
            let t =  new Date().getTime() ;
            let t1 = t - 3*24*60*60*1000;
            this.$api.gainTotalBalance({exchange : 'fundaccount' , account_id : '1', beginday : '20190510', endday :  '20190621'}).then(obj=>{
                console.log(JSON.parse(obj.data[0].endbalance));
            })
        }
    }
}

</script>

<style>

</style>

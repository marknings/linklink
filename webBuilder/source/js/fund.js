(function(){
    var products={};
    products.openDetail=function(item){
        var instance=$.modal.open({template:"fundDetail.html",
            controller:function(data){
                $.bindData.compileAll($('#modalProduct'),data);
            },
            data:item,
            canMove:true
        });
    };
    products.confirm=function(item){
            var instance=$.modal.comfirmation({
                    message:"你确定要预确认【"+JSON.stringify(item).substring(0,100)+"...】基金吗？",
                    title:"预确认基金",
                    comfirm:function(){
                        instance=$.modal.success({
                                    title:"预确认基金",
                                    message:"预确认基金成功！"
                         });
                        instance.result.then(function(){
                                $.modal.close();
                            });
                        /*$.post(deleteCom,item,function(data){
                            var instance;
                            if(!!data.status){
                                instance=$.modal.success({
                                    title:"预确认数据",
                                    message:"预确认数据成功！"
                                    });
                            }else{
                                instance=$.modal.wrong({
                                    title:"预确认数据",
                                    message:"预确认数据失败！"
                                    });
                            }
                            instance.result.then(function(){
                                $.modal.close();
                            });
                        });*/
                    }
                });
    };
    products.confirmPre=function(item){
        var instance=$.modal.comfirmation({
                    message:"你确定要确认【"+JSON.stringify(item).substring(0,100)+"...】基金吗？",
                    title:"确认基金",
                    comfirm:function(){
                        instance=$.modal.success({
                                    title:"确认基金",
                                    message:"确认基金成功！"
                         });
                        instance.result.then(function(){
                                $.modal.close();
                            });
                    }
                });
    };
    var loadInstance=$.modal.loading({message:"加载数据中..."});
    $.getJSON('jsonData/fundData.json',{},function(data){
        products.data=data.data;
        $.bindData.compileAll($('#productTable'),products);
        loadInstance.open.then(function(){                
                loadInstance.close();
            });
    });
})()



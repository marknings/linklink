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
    products.addFund=function(titem){
                var item=titem||{};
                var dataItem={};
                item.title="新增基金数据";
                item.comfirm=function(){
                    var tempData=$.getElemData.compileAll($("#modalProduct"),dataItem);
                    /*$.post(insertCom,tempData,function(data){
                        var instance;
                        if(!!data.status){
                                instance=$.modal.success({
                                    title:"新增数据",
                                    message:"新增数据成功！"
                                    });
                            }else{
                                instance=$.modal.wrong({
                                    title:"新增数据",
                                    message:"新增数据失败！"
                                    });
                            }
                            instance.result.then(function(){
                                $.modal.close();
                            });
                    });*/
                    instance=$.modal.success({
                                    title:"新增数据",
                                    message:"新增数据成功！"
                                    });
                    instance.result.then(function(){
                                $.modal.close();
                            });
                };
                var instance=$.modal.open({template:"bankDetail.html",
                    controller:function(data){
                        $.bindData.compileAll($("#modalProduct"),data);
                    },
                    data:item,
                    canMove:true
                });
                instance.result.then(function(){
                    /*teamsValue.getDataByPageIndex(teamsValue.pageNo);*/
                });
            }
    var loadInstance=$.modal.loading({message:"加载数据中..."});
    $.getJSON('jsonData/bankData.json',{},function(data){
        products.data=data.data;
        $.bindData.compileAll($('#ProductEle'),products);
        loadInstance.open.then(function(){                
                loadInstance.close();
            });
    });
})()



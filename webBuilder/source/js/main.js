(function(){
    var $$id=0;
    var modalArray=[];
    var modalTemplate=[];
    function getTemplate(str){
        for(var i=0;i<modalTemplate.length;i++){
            if(modalTemplate[i].key===str){
                return modalTemplate[i].value;
            }
        }
        return undefined;
    }
    //modal扩展
    $.extend({
        modal: {
            setTemplate:function(key,value){
                modalTemplate.push({key:key,value:value});
            },
            comfirmation:function(item){
                var instance=$.modal.open({template:"comfirmation.html",
                    controller:function(data){
                        $.bindData.compileAll($('#comfirmation'),data);
                    },
                    data:item,
                    canMove:true
                });
                return instance;
            },
            success:function(item){
                var instance=$.modal.open({template:"success.html",
                        controller:function(data){
                            $.bindData.compileAll($('#success'),data);
                        },
                        data:item,
                        canMove:true
                });
                return instance;
            },
            wrong:function(item){
                var instance=$.modal.open({template:"wrong.html",
                        controller:function(data){
                            $.bindData.compileAll($('#wrong'),data);
                        },
                        data:item,
                        canMove:true
                });
                return instance;
            },
            loading:function(item){
                var instance=$.modal.open({template:"loading.html",
                        controller:function(data){
                            $.bindData.compileAll($('#loading'),data);
                        },
                        data:item,
                        canMove:true
                });
                return instance;
            },
            close:function(){
                if(modalArray.length>0){                    
                    var modalDom=modalArray[modalArray.length-1];
                    modalDom.modal("hide");
                }
            },
            open: function (options) {
                if (!options.template) {
                    throw '$.modal() options.template is need!';
                }
                var str,
                    opendef= $.Deferred(),
                    resultdef= $.Deferred(),
                    position=[],
                    modalDom;
                
                if(!(str=getTemplate(options.template))){
                    $.get(options.template,function(data){
                        str=data;
                        modalDom = $(str);
                        modalTemplate.push({key:options.template,value:str});
                        openEvents(modalDom);
                    });
                }else{
                    modalDom = $(str);
                    openEvents(modalDom);
                }
                var returnDef={
                    open:opendef.promise(),
                    result:resultdef.promise(),
                    close:function(){
                        modalDom.modal("hide");
                    }
                }
                return returnDef;

                function openEvents(modalDom){
                    modalDom.off('shown.bs.modal').on('shown.bs.modal', function (e) {
                        $(document).off('focusin.modal');
                        !!options.controller&&options.controller(options.data);
                        var length=$(".modal-dialog").not($(".no-dialog")).length;
                        setCenter(length,modalDom);
                        if(options.canMove!==false){
                            setMove(length,modalDom);
                        }
                        modalArray.unshift(modalDom);
                        opendef.resolve('shown');
                        
                    });
                    modalDom.on('hidden.bs.modal', function (e) {
                        $(e.currentTarget).remove();
                        resultdef.resolve('hidden');
                        modalArray.shift(modalDom);
                    });
                    $(document.body).append(modalDom);                    
                    modalDom.modal({backdrop:'static',keyboard:false,show:true,});
                }
                function setCenter(length,modalDom){
                    //var modalElem=$(".modal-dialog").not($(".no-dialog")).eq(length-1);
                    var modalElem=modalDom.find(".modal-dialog").not($(".no-dialog"));
                    var clientHeight=modalElem.innerHeight(),
                        leftHeight=window.innerHeight-modalElem.innerHeight(),
                        leftWidth=window.innerWidth-modalElem.innerWidth();
                    var style={
                        height:clientHeight+"px",
                        top:leftHeight/2-leftHeight/4+'px',
                        right:leftWidth/2+'px',
                        bottom:leftHeight/2+leftHeight/4+'px',
                        left:leftWidth/2+'px',
                        margin:"auto",
                        position:"absolute"}
                    modalElem.css(style);
                }

                function setMove(length,modalDom){
                    //var modalElem=$(".modal-dialog").not($(".no-dialog")).eq(length-1);
                    var modalElem=modalDom.find(".modal-dialog").not($(".no-dialog"));
                    var isMove=false,
                        X= 0,Y=0,
                        leftHeight=window.innerHeight-modalElem.innerHeight(),
                        leftWidth=window.innerWidth-modalElem.innerWidth();
                    position[length-1]={};
                    position[length-1].top=leftHeight/2-leftHeight/4;
                    position[length-1].left=leftWidth/2;
                    position[length-1].bottom=leftHeight/2+leftHeight/4;
                    position[length-1].right=leftWidth/2;

                    function setCss(e){
                        position[length-1].top=position[length-1].top+(e.screenY-Y);
                        position[length-1].left=position[length-1].left+(e.screenX-X);
                        position[length-1].bottom=position[length-1].bottom-(e.screenY-Y);
                        position[length-1].right=position[length-1].right-(e.screenX-X);
                        var clientHeight=modalElem.innerHeight();
                        var style={
                            height:clientHeight+"px",
                            top:position[length-1].top+"px",
                            right:position[length-1].right+"px",
                            bottom:position[length-1].bottom+"px",
                            left:position[length-1].left+"px",
                            margin:"auto",
                            position:"absolute"}
                        modalElem.css(style);
                        X= e.screenX;
                        Y= e.screenY;
                    }
                    //var modalHeader=$('.modal-header').not($(".no-dialog .modal-header")).eq(length-1);
                    var modalHeader=modalDom.find('.modal-header').not($(".no-dialog .modal-header"));
                    modalHeader.on('mousedown',function(e){
                        isMove=true;
                        X= e.screenX;
                        Y= e.screenY;
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    modalHeader.on('mouseup',function(e){
                        if(isMove){
                            isMove=false;
                            setCss(e);
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    modalHeader.on('mousemove',function(e){
                        if(isMove){
                            setCss(e);
                        }
                        e.preventDefault();
                        e.stopPropagation();
                    })
                }
            }
        },
        bindData:{
            newId:function(){
                return $$id++;
            },
            //将str express转化为function
            parse:function(parseStr){
                var str='try{ return data.'+parseStr+';}catch(e){return ""}';
                //var func=new Function('data','return data.'+parseStr+';');
                var func=new Function('data',str);
                return func;
            },
            parsefunc:function(parseStr){
                var funcReg=/^(\w+)\((.*)\)/;
                var funcArgs=funcReg.exec(parseStr);
                var funcName=funcArgs[1];
                var args=funcArgs[2].split(',');
                var argStr='';
                for(var i=0;i<args.length;i++){
                    if(!!!args[i]){
                        break;
                    }
                    if(i!==0){
                        argStr=argStr+' ,';
                    }
                    argStr=argStr+'data.'+args[i];
                }
                var func=new Function('data','return data.'+funcName+'('+argStr+')');
                return func;
            },
            parseIndex:function(parseStr){
                var func=new Function('data','return '+' (data.pageNo-1)*data.pageSize+'+'data.'+parseStr+';');
                return func;
            },
            bind:function(ele,value){
                for(var i=0;i<ele.length;i++){
                    var tagName=ele[i].tagName;
                    switch (tagName){
                        case'SPAN':
                        case 'P':
                        case 'TD':
                        case 'DIV':
                            var selector=ele.eq(i);
                            selector.text(value);
                            if(selector.attr('title')!=undefined){
                                selector.attr('title',value);
                            }
                            break;
                        case 'INPUT':
                        case  'TEXTAREA':
                            ele.eq(i).val(value);
                            break;
                        case 'IMG':
                            ele.eq(i).attr('src',value);
                        default:
                            ele.eq(i).text(value);
                            break;
                    }
                }
            },            
            compileBind:function(ele,data){
                var elems=ele.find('[ns-bind]');
                for(var i=0;i<elems.length;i++){
                    var func=$.bindData.parse(elems.eq(i).attr('ns-bind'));
                    var value;
                    if(elems.eq(i).data().hasOwnProperty('$$nsId')){
                        value=func(elems.eq(i).data());
                    }else{
                        value=func(data);
                    }
                    $.bindData.bind(elems.eq(i),value);
                }
            },
            compileDisabled:function(ele,data){
                var elems=ele.find('[ns-disabled]');
                for(var i=0;i<elems.length;i++){
                    var func=$.bindData.parse(elems.eq(i).attr('ns-disabled'));
                    var value;
                    if(elems.eq(i).data().hasOwnProperty('$$nsId')){
                        value=func(elems.eq(i).data());
                    }else{
                        value=func(data);
                    }
                    if(value===true){
                        elems.eq(i).attr('disabled','disabled')
                    }else{
                        elems.eq(i).removeAttr('disabled');
                    }
                }
            },
            compileIndex:function(ele,data){
                var elems=ele.find('[ns-index]');
                for(var i=0;i<elems.length;i++){
                    var func=$.bindData.parseIndex(elems.eq(i).attr('ns-index'));
                    var value;
                    if(elems.eq(i).data().hasOwnProperty('$$nsId')){
                        value=func(elems.eq(i).data());
                    }else{
                        value=func(data);
                    }
                    $.bindData.bind(elems.eq(i),value);
                }
            },
            compileRepeat:function(ele,data){
                var exceptEle=ele.find('.ns-file.ns-scope').find('[ns-repeat]');
                ele.find('[ns-repeat].ns-scope').not(exceptEle).remove();
                var elems=ele.find('[ns-repeat]').not(exceptEle);
                for(var i=0;i<elems.length;i++){
                    var expre=elems.eq(i).attr('ns-repeat');
                    var args=expre.split(' ');
                    var reData=$.bindData.parse(args[2].replace(/ /g,''))(data);
                    var reItemStr=args[0].replace(/ /g,'');
                    if(!((reData instanceof Array)&&reData.length!=0)){
                        elems.eq(i).hide();
                        return ;
                    }
                    elems.eq(i).show();
                    for(var j=0;j<reData.length;j++){
                        data[reItemStr]=reData[j];
                        data.$index=j+1;
                        var cloneEle= elems.eq(i).clone(true);
                        data.$$nsId=$.bindData.newId();
                        cloneEle.find('[ns-bind]').data(data);
                        cloneEle.find('[ns-click]').data(data);
                        cloneEle.find('[ns-index]').data(data);
                        cloneEle.find('[ns-submit]').data(data);
                        if(j!==0){
                            cloneEle.addClass("ns-scope");
                        }
                        cloneEle.insertBefore(elems.eq(i));
                    }
                    elems.eq(i).remove();
                }
            },
            compileFile:function(ele,data){
                    var fileStr='<div id="fileUpload">'+
                                '<div style="position:relative;">'+
                                    '<button style="width:100px;" class="btn btn-primary">上传</button>'+
                                    '<input style="position: absolute; opacity: 0; filter:Alpha(opacity=0);width:100px;left:0;top:0; " type="file" name="file" id="file1" />'+
                                '</div>'+
                                '<div class="table-response">'+
                                    '<table class="table table-bordered">'+
                                        '<thead>'+
                                           ' <tr>'+
                                                '<th>#</th>'+
                                                '<th>文件</th>'+
                                                '<th>操作</th>'+
                                            '</tr>'+
                                        '</thead>'+
                                        '<tbody>'+
                                            '<tr ns-repeat="mitem in data">'+
                                                '<td ns-bind="$index"></td>'+
                                                '<td ><a ns-click="downLoadFile(mitem)" ns-bind="mitem.filename"></a></td>'+
                                                '<td>'+
                                                    '<a ns-click="deleteFile(mitem)">删除</a>'+
                                                '</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</div>';
                /*if(!ele.find('#fileUpload.ns-scope').data().hasOwnProperty('deleteFile')){
                    ele.find('#fileUpload.ns-scope').remove();
                } */               
                var elems=ele.find('[ns-file]');
                for(var i=0;i<elems.length;i++){
                    var nsFile=elems.eq(i);
                    var expre=nsFile.attr('ns-file');
                    var reData=$.bindData.parse(expre.replace(/ /g,''))(data);
                    var elemFile=$(fileStr);
                    elemFile.addClass("ns-file").addClass('ns-scope');

                    var fileData={data:[]};
                    if(reData instanceof Array){
                        fileData.data=reData;
                    }
                    if(typeof(reData)=='string'){
                        try{
                            fileData.data=JSON.parse(reData);
                            if(typeof(fileData.data)=='string'){
                                fileData.data=JSON.parse(fileData.data);
                            }
                        }catch(e){
                            fileData.data=new Array();
                        }
                    }

                    fileData=$.extend(fileData,{
                        deleteFile:function(item){
                            var tempFileData=nsFile.data();
                            tempFileData.data.shift(item);
                            $.bindData.compileAll($('#fileUpload'),tempFileData);
                            nsFile.data(tempFileData);

                           // console.log(tempFileData);
                        },
                        downLoadFile:function(item){
                           // console.log(item);
                            location.href='/downLoadFile?fileId='+item.fileId;
                        }
                    });

                    var instanceLoading;
                    elemFile.find("#file1").AjaxFileUpload({
                        onComplete: function(filename, response) {                            
                            fileData.data.push({filename:filename,fileId:response.data.insertId});
                            nsFile.data(fileData);
                            $.bindData.compileAll($('#fileUpload'),fileData);
                            instanceLoading.close();
                        },
                        onSubmit:   function(filename) {
                            instanceLoading=$.modal.loading({message:"文件上传中..."});
                        }
                    });

                    elemFile.insertBefore(elems.eq(i));
                    $.bindData.compileAll($('#fileUpload'),fileData);
                    nsFile.data(fileData);
                    //elemFile.data(fileData);
                }
            },
            compileClick:function(ele,data){
                var elems=ele.find('[ns-click]');
                for(var i=0;i<elems.length;i++){
                    elems.eq(i).off('click');
                    elems.eq(i).on('click',function(e){
                        var func=$.bindData.parsefunc($(this).attr('ns-click'));
                        var thisData=$(this).data();
                        if(thisData.hasOwnProperty('$$nsId')){
                            func(thisData);
                        }else{
                            func(data);
                        }
                    });
                }
            },
            compileSubmit:function(ele,data){
                var elems=ele.find('[ns-submit]');
                for(var i=0;i<elems.length;i++){
                    elems.eq(i).off('submit');
                    elems.eq(i).on('submit',function(e){
                        var func=$.bindData.parsefunc($(this).attr('ns-submit'));
                        var thisData=$(this).data();
                        if(thisData.hasOwnProperty('$$nsId')){
                            func(thisData);
                        }else{
                            func(data);
                        }
                        return false;
                    });
                }
            },
          /*  items:[
          'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
        'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink', '|', 'about'
                            ]*/
            compileKindEditor:function(ele,data){
                ele.find('.ke-container').remove();
                var exceptEle=ele.find('[ns-kindeditor].ns-scope');
                var elems=ele.find('[ns-kindeditor]').not(exceptEle);
                exceptEle.remove();
                for(var i=0;i<elems.length;i++){
                    var nsKE=elems.eq(i);
                    var expre=nsKE.attr('ns-kindeditor');
                    var reData=$.bindData.parse(expre.replace(/ /g,''))(data);                    
                    
                    var elemClone=$(nsKE).clone();
                    elemClone.addClass('ns-scope');
                    nsKE.hide();
                    elemClone.insertBefore(nsKE);
                    var editor = KindEditor.create(elemClone, {
                            allowFileManager : false,
                            uploadJson: '/uploadImg',
                            items:[
                                'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template',  'cut', 'copy', 'paste',
        'plainpaste', 'wordpaste',  'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript','fullscreen','/',
        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 
        'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',  '/',
        'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
        'anchor', 'link', 'unlink'
                            ],
                            resizeType:1,
                            afterCreate:function(){
                                this.readonly(false);
                            }
                            });
                    editor.html(reData);
                    nsKE.data(editor);
                    setTimeout(function(){
                        var ke=$('.ke-container');
                        var kep=ke.parent();
                        ke.width(kep.width());
                    });                                   
                }
            },
            compileAll:function(ele,data){
                $.bindData.compileKindEditor(ele,data);
                $.bindData.compileFile(ele,data);
                $.bindData.compileRepeat(ele,data);
                $.bindData.compileBind(ele,data);
                $.bindData.compileClick(ele,data);
                $.bindData.compileDisabled(ele,data);
                $.bindData.compileIndex(ele,data);
                $.bindData.compileSubmit(ele,data);
            }
        },
        getElemData:{
            parse:function(parseStr,iter){
                var iterator;
                if(iter===undefined){                    
                    iterator='.';
                }else{
                    iterator=iter;
                }
                var args=parseStr.split(iterator);
                if(args.length>0){
                    return args[args.length-1];
                }else{
                    return "";
                }
            },
            getValue:function(ele,item,parseStr){
                for(var i=0;i<ele.length;i++){
                    var tagName=ele[i].tagName;
                    switch (tagName){
                        case'SPAN':
                        case 'P':
                        case 'TD':
                        case 'DIV':
                            var selector=ele.eq(i);
                            item[parseStr]=selector.text();
                            break;
                        case 'INPUT':
                        case  'TEXTAREA':
                            item[parseStr]=ele.eq(i).val();
                            break;
                        case 'IMG':
                            item[parseStr]=ele.eq(i).attr('src');
                        default:
                            var selector=ele.eq(i);
                            item[parseStr]=selector.text();
                            break;
                    }
                }
            },
            compileBind:function(ele,item){
                if(typeof(item)!='object'){
                    item={};
                }
                var elems=ele.find('[ns-bind]').not(ele.find('.ns-scope [ns-bind]')).not(ele.find('[ns-repeat] [ns-bind]'));
                for(var i=0;i<elems.length;i++){
                    var parseStr=$.getElemData.parse(elems.eq(i).attr('ns-bind'));                    
                    $.getElemData.getValue(elems.eq(i),item,parseStr);
                }
                return item;
            },
            compileRepeat:function(ele,item){
                if(typeof(item)!='object'){
                    item={};
                }
                var elems=ele.find('[ns-repeat]');
                var elemRepeats=ele.find('[ns-repeat]').not('[ns-repeat].ns-scope');
                for(var j=0;j<elemRepeats.length;j++){
                    var parseStr=$.getElemData.parse(elemRepeats.eq(j).attr('ns-repeat'),' ');
                    item[parseStr]=new Array(); 
                }
                for(var i=0;i<elems.length;i++){
                    var parseStr=$.getElemData.parse(elems.eq(i).attr('ns-repeat'),' ');
                    var bindItem=$.getElemData.compileBind(elems.eq(i));
                    item[parseStr].push(bindItem);
                }
                return item;
            },
            compileFile:function(ele,item){
                if(typeof(item)!='object'){
                    item={};
                }
                var elems=ele.find('[ns-file]');
                for(var i=0;i<elems.length;i++){
                    var parseStr=$.getElemData.parse(elems.eq(i).attr('ns-file'));
                    item[parseStr]=JSON.stringify(elems.eq(i).data().data);
                    item[parseStr+'Length']=elems.eq(i).data().data.length;
                }
                return item;
            },
            compileKindEditor:function(ele,item){
                if(typeof(item)!='object'){
                    item={};
                }
                var exceptEle=ele.find('[ns-kindeditor].ns-scope');
                var elems=ele.find('[ns-kindeditor]').not(exceptEle);
                /*exceptEle.remove();*/
                for(var i=0;i<elems.length;i++){
                    var nsKE=elems.eq(i);
                    var expre=nsKE.attr('ns-kindeditor').replace(/ /g,'');

                    var KindEditor=nsKE.data();
                    item[expre]=KindEditor.html();
                    return item;                   
                }
            },
            compileAll:function(ele,item){
                if(typeof(item)!='object'){
                    item={};
                }
                $.getElemData.compileRepeat(ele,item);
                $.getElemData.compileBind(ele,item);
                $.getElemData.compileFile(ele,item);
                $.getElemData.compileKindEditor(ele,item);
                return item;
            }
        },
        cookie:{
                //hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。  
                setCookie:function(name,value,hours,path){  
                    var name = escape(name);  
                    var value = escape(value);  
                    var expires = new Date();  
                    expires.setTime(expires.getTime() + hours*3600000);  
                    path = path == "" ? "" : ";path=" + path;  
                    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();  
                    document.cookie = name + "=" + value + _expires + path;  
                },
                //获取cookie值  
                getCookieValue:function(name){  
                    var name = escape(name);  
                    //读cookie属性，这将返回文档的所有cookie  
                    var allcookies = document.cookie;         
                    //查找名为name的cookie的开始位置  
                    name += "=";  
                    var pos = allcookies.indexOf(name);      
                    //如果找到了具有该名字的cookie，那么提取并使用它的值  
                    if (pos != -1){                                             //如果pos值为-1则说明搜索"version="失败  
                        var start = pos + name.length;                  //cookie值开始的位置  
                        var end = allcookies.indexOf(";",start);        //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
                        if (end == -1) end = allcookies.length;        //如果end值为-1说明cookie列表里只有一个cookie  
                        var value = allcookies.substring(start,end);  //提取cookie的值  
                        return unescape(value);                           //对它解码        
                        }     
                    else return "";                                             //搜索失败，返回空字符串  
                },
                //删除cookie  
                deleteCookie:function(name,path){  
                    var name = escape(name);  
                    var expires = new Date(0);  
                    path = path == "" ? "" : ";path=" + path;  
                    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;  
                }
        },
        setPage:function(pageConfig){
            var teamsValue=pageConfig.teamsValue,
                bodyId=pageConfig.bodyId,
                detailId=pageConfig.detailId,
                getCom=pageConfig.getCom,
                insertCom=pageConfig.insertCom,
                deleteCom=pageConfig.deleteCom,
                editCom=pageConfig.editCom,
                detailTemplate=pageConfig.detailTemplate;
            
            var pageNumber;
            if(typeof(teamsValue)!='object'){
                teamsValue={};
            }
            teamsValue.pageNo=1;
            teamsValue.pageSize=5;

            teamsValue.editTeam=function(titem){
                var item=$.extend({},titem);
                var dataItem=$.extend({},titem);
                item.title="修改数据";
                item.comfirm=function(){
                    var tempData=$.getElemData.compileAll($(pageConfig.editId||detailId),dataItem);
                    if(!!pageConfig.beforeEditPost){
                        tempData=pageConfig.beforeEditPost(tempData);
                    }
                    $.post(editCom,tempData,function(data){
                        var instance;
                        if(!!data.status){
                                instance=$.modal.success({
                                    title:"修改数据",
                                    message:"修改数据成功！"
                                    });
                            }else{
                                instance=$.modal.wrong({
                                    title:"修改数据",
                                    message:"修改数据失败！"
                                    });
                            }
                            instance.result.then(function(){
                                $.modal.close();
                            });
                    });
                    //console.log(tempData);
                };
                var instance=$.modal.open({template:pageConfig.editTemplate||detailTemplate,
                    controller:function(data){
                        if(!!pageConfig.editController){
                            pageConfig.editController(pageConfig,data);
                        }else{                            
                            $.bindData.compileAll($(pageConfig.editId||detailId),data);
                        }
                    },
                    data:item,
                    canMove:true
                });
                instance.result.then(function(){
                    teamsValue.getDataByPageIndex(teamsValue.pageNo);
                });
            };

            teamsValue.deleteTeam=function(item){
                var instance=$.modal.comfirmation({
                    message:"你确定要删除【"+JSON.stringify(item).substring(0,100)+"...】数据吗？",
                    title:"删除数据",
                    comfirm:function(){
                        $.post(deleteCom,item,function(data){
                            var instance;
                            if(!!data.status){
                                instance=$.modal.success({
                                    title:"删除数据",
                                    message:"删除数据成功！"
                                    });
                            }else{
                                instance=$.modal.wrong({
                                    title:"删除数据",
                                    message:"删除数据失败！"
                                    });
                            }
                            instance.result.then(function(){
                                $.modal.close();
                            });
                        });
                    }
                });
                instance.result.then(function(){
                    teamsValue.getDataByPageIndex(1);
                });
            };

            teamsValue.addTeam=function(titem){
                var item=titem||{};
                var dataItem={};
                if(!!pageConfig.addConfig){
                    item=pageConfig.addConfig(item);
                }
                item.title="新增数据";
                item.comfirm=function(){
                    var tempData=$.getElemData.compileAll($(detailId),dataItem);
                    $.post(insertCom,tempData,function(data){
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
                    });
                };
                var instance=$.modal.open({template:detailTemplate,
                    controller:function(data){
                        $.bindData.compileAll($(detailId),data);
                    },
                    data:item,
                    canMove:true
                });
                instance.result.then(function(){
                    teamsValue.getDataByPageIndex(teamsValue.pageNo);
                });
            }

            teamsValue.prev=function(){
                var index=teamsValue.pageNo>1?teamsValue.pageNo-1:teamsValue.pageNo;
                teamsValue.getDataByPageIndex(index);
            };
            teamsValue.next=function(){
                var index=teamsValue.pageNo<pageNumber?teamsValue.pageNo+1:teamsValue.pageNo;
                teamsValue.getDataByPageIndex(index);
            };
            teamsValue.goto=function(index){        
                teamsValue.getDataByPageIndex(index);
            };
            teamsValue.getDataByPageIndex=function(index){
                teamsValue.pageNo=index;        
                $.getJSON(getCom,{pageNo:teamsValue.pageNo,pageSize:teamsValue.pageSize},function(data){
                    teamsValue.data=data.data;
                    teamsValue.IndexArray=[];
                    pageNumber=Math.ceil(data.totalCount/data.pageSize);
                    for(var i=0;i<pageNumber;i++){
                        teamsValue.IndexArray.push({index:i+1});
                    }
                    $.bindData.compileAll($(bodyId),teamsValue);
                    $('.pagination li').removeClass("active").eq(index).addClass("active");
                });
            };
            return teamsValue;
        }
    });
})();
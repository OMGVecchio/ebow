$(function(){
    /********** 翻页函数 **********/
    function createPagination($container){
        var countAll = $container.data('count'); // 总数据量
        var currentPage = $container.data('number'); // 当前页数
        var href = $container.data('href'); // 翻页跳转处理路由

        var options = {
            dataSource: new Array(countAll)
        };
        $container.pagination(options); // 初始化组件
        $container.find('li[data-num='+ currentPage +']').trigger('click'); // 初始化当前页面
        $container.find('li:not(.disabled)').on('click', function(){
            /**
             * 为了满足组件化需求,使用的是"&page",所以在后端返回的href中始终添加"?status=ok做前缀"
             * 这样,能解决不同页面传递的查询值不同的问题,即页面独有的条件查询跟href一起以"path?q=p"形式返回
             */
            window.location.href = href + '&page='+$(this).data('num');
        });
        return $container;
    }
    var $container = $('#pagination');
    if($container.get(0)){
        createPagination($container);
    }

    /********* 提示 **********/
    $('[data-toggle=tooltip]').tooltip();

    /********* 弹出 **********/
    $("[data-toggle='popover']").popover();
});
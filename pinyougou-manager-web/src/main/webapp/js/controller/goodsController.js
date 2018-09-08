//控制层
app.controller('goodsController', function ($scope, $controller, $location, goodsService, itemCatService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    };

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };
    $scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};
    //查询实体
    $scope.findOne = function () {
        var id = $location.search()["id"];
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                // 设置富文本编辑
                editor.html($scope.entity.goodsDesc.introduction);
                // 设置图片显示
                $scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
                alert($scope.entity.goodsDesc.itemImages);
                // 设置扩张属性
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                // 设置规格
                $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
                // 设置规格列表
                var itemList = $scope.entity.itemList;
                for (var i = 0; i < itemList.length; i++) {
                    itemList[i].spec = JSON.parse(itemList[i].spec);
                }

            }
        );
    };

    $scope.updateStatus = function (status) {
        goodsService.updateStatus(status, $scope.selectIds).success(function (response) {
            if (response.success) {//成功
                $scope.reloadList();//刷新列表
                $scope.selectIds = [];//清空ID集合
            } else {
                alert(response.message);
            }

        })
    };
    s
    $scope.deleteStatus = function (status) {
        goodsService.deleteStatus(status, $scope.selectIds).success(function (response) {
            if (response.success) {//成功
                $scope.reloadList();//刷新列表
                $scope.selectIds = [];//清空ID集合
            } else {
                alert(response.message);
            }

        })
    };

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.reloadList();//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象
    $scope.status = ['未审核', '已审核', '审核未通过', '关闭'];//商品状态
    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };
    $scope.itemCats = [];
    $scope.findItemCat = function () {
        itemCatService.findAll().success(function (response) {
            for (var i = 0; i < response.length; i++) {
                $scope.itemCats[response[i].id] = response[i].name;
            }
        })
    };

});	

//控制层
app.controller('itemCatController', function ($scope, $controller, itemCatService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        itemCatService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        itemCatService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function (id) {
        itemCatService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.id != null) {//如果有ID
            serviceObject = itemCatService.update($scope.entity); //修改
        } else {
            switch ($scope.status) {
                case 1:
                    $scope.entity.parentId = "0";
                    break;
                case 2:
                    $scope.entity.parentId = $scope.entity_1.id;
                    break;
                default:
                    $scope.entity.parentId = $scope.entity_2.id;
                    break;
            }
            serviceObject = itemCatService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //重新查询
                    $scope.findByParentId($scope.entity.parentId);//重新加载
                } else {
                    alert(response.message);
                }
            }
        );
    }

    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        itemCatService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    switch ($scope.status) {
                        case 1:
                            $scope.findByParentId("0");//刷新列表
                            break;
                        case 2:
                            $scope.findByParentId($scope.entity_1.id);//刷新列表;
                            break;
                        default:
                            $scope.findByParentId($scope.entity_2.id);
                            break;
                    }
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        itemCatService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    $scope.findByParentId = function (id) {
        itemCatService.findByParentId(id).success(function (response) {
            $scope.list = response;
        })
    }

    $scope.status = 1;

    $scope.setStatus = function (val) {
        $scope.status = val;
    }

    $scope.selectList = function (s_entity) {
        switch ($scope.status) {
            case 1:
                $scope.entity_1 = null;
                $scope.entity_2 = null;
                break;
            case 2:
                $scope.entity_1 = s_entity;
                $scope.entity_2 = null;
                break;
            default:
                $scope.entity_2 = s_entity;
                break;
        }

        $scope.findByParentId(s_entity.id);
    }


    $scope.findTypeTemplateList = function () {
        itemCatService.selectOptionList().success(function (response) {
            $scope.typeTemplateList = response;
        })
    }
});	

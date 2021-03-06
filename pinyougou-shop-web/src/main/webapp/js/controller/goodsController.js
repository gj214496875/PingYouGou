//控制层
app.controller('goodsController', function ($scope, $controller, $location, goodsService, uploadService, itemCatService, typeTemplateService) {

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

    // 复选框状态
    $scope.checkAttributeValue = function (attributeName, attributeValue) {
        var arry = $scope.entity.goodsDesc.specificationItems;
        var object = $scope.searchObjectByKey(arry, 'attributeName', attributeName);
        if (object == null) {
            return false;
        } else {
            if (object.attributeValue.indexOf(attributeValue) >= 0) {
                return true;
            } else {
                return false;
            }
        }

    };

    //保存
    $scope.save = function () {
        $scope.entity.goodsDesc.introduction = editor.html();
        var serviceObject;//服务层对象
        if ($scope.entity.goods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    alert('保存成功');
                    location.href = "goods.html";
                } else {
                    alert(response.message);
                }
            }
        );
    };

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
    };

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

    $scope.uploadFile = function () {
        uploadService.uploadFile().success(function (response) {
            if (response.success) {
                //设置文件地址
                $scope.image_entity.url = response.message;
            } else {
                alert(response.message);
            }
        })
    };

    $scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};

    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    };

    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    };

    //查询第一个下拉列表数据
    $scope.find1List = function () {
        itemCatService.findByParentId(0).success(function (response) {
            $scope.itemCat1List = response;
        });
    };

    // 查询第二个下拉列表数据
    $scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat2List = response;
        });
    });

    // 查询第三个下拉列表数据
    $scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat3List = response;
        });
    });

    //  读取模板ID
    $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(function (response) {
            $scope.entity.goods.typeTemplateId = response.typeId;
        });
    });

    //确定模版ID后，读取品牌列表
    $scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(function (response) {
            $scope.typeTemplate = response;
            $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);

            //扩展属性
            if ($location.search()["id"] == null) {
                //新增
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
            }
        });

        //获取规格列表
        typeTemplateService.selectSpecList(newValue).success(function (response) {
            $scope.specList = response;
        })
    });

    // 选择规格
    $scope.updateSpecAttribute = function ($event, name, value) {
        //$scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, "attributeName", name);
        if (object != null) {
            if ($event.target.checked) {
                //选中
                object.attributeValue.push(value);
            } else {
                //取消选中
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                // 如果该规格的选项都取消，将此条记录移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                }

            }
        } else {
            $scope.entity.goodsDesc.specificationItems.push({"attributeName": name, "attributeValue": [value]});
        }
    };

    $scope.getItemList = function () {
        //$scope.entity.itemList = [{spec: {'网络'：4G，'内存':16G}, price: 0, num: 9999}];
        $scope.entity.itemList = [{spec: {}, price: 0, num: 9999}];
        var specs = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0; i < specs.length; i++) {
            $scope.entity.itemList = addColumn($scope.entity.itemList, specs[i].attributeName, specs[i].attributeValue);
        }
    };

    var addColumn = function (arry, attributeName, attributeValues) {
        var newList = [];
        for (var i = 0; i < arry.length; i++) {
            var oldRow = arry[i];
            for (var j = 0; j < attributeValues.length; j++) {
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[attributeName] = attributeValues[j];
                newList.push(newRow);
            }
        }
        return newList;
    }
});



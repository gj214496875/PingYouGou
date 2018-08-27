package com.pinyougou.sellergoods.service.impl;


import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by Enzo Cotter on 2018/8/27.
 */
@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private TbBrandMapper tbBrandMapper;

    @Override
    public PageResult findPage(PageResult result) {
        PageHelper.startPage(result.getCurrentPage(), result.getSize());
        Page<TbBrand> brands = (Page<TbBrand>) tbBrandMapper.selectByExample(null);
        result.setTotal(brands.getTotal());
        result.setRows(brands.getResult());
        return result;
    }
}

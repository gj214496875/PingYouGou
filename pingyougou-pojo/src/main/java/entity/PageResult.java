package entity;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Enzo Cotter on 2018/8/27.
 */
public class PageResult implements Serializable {
    private Long total;
    private Integer size;
    private Integer currentPage;
    private List rows;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }
}

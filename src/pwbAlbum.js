/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-24 15:09:17
 * @version $Id$
 */

/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-24 00:01:04
 * @version $Id$
 */

    var PwbAlbum = function(opts) {

        // 布局的枚举类型
        this.LAYOUT = {
            SQUARE: 0,
            PUZZLE: 1,    // 拼图布局
            WATERFALL: 2, // 瀑布布局
            BARREL: 3     // 木桶布局
        };

        // 公有变量可以写在这里
        // this.xxx = ...
        this.opts = opts || {};
        
    };

    // 私有变量可以写在这里
    // var xxx = ...
	var _option = {
        //共有属性
        layout: '',
        isFullscreen:false,
        image: [],
        gutter: 0,
        boxSelector:'',
        photoSelector:'',
        //瀑布流属性
        cols: 4,
        //木桶属性
        minH: 100,
        maxH: 300,
        minNum: 3,
        maxNum: 6,
        //方形属性
        size: 100
    };
    /************* 以下是本库提供的公有方法 *************/

    /**
     * 设置拼图布局   
     * 
     * @param {(string|string[])} image  一张图片的 URL 或多张图片 URL 组成的数组
     * @param {object}            option 配置项
     */
    PwbAlbum.prototype.setPuzzle = function() {
        var $boxes = this.getImageDomElements();
        var $parent = this.getParentDomElements();
        $parent.css('height','500px');
        if($boxes.length>6){
            alert('The PUZZLE only can include six pictures!');
            _option.layout = 'SQUARE';
            this.setLayout(_option.layout);
            return;
        }
        $boxes.removeClass();
        $boxes.addClass('photoBox');
        $boxes.addClass('photo_'+$boxes.length);
    };



    /**
     * 设置方形布局  
     */
     PwbAlbum.prototype.setSquare = function() {
         // body...
        var $boxes = this.getImageDomElements();

        $boxes.removeClass();
        $boxes.addClass('photoBox');
        $boxes.addClass('square');
        $boxes.css('width',_option.size+'px').css('height',_option.size+'px');

     };


    /**
     * 设置瀑布流布局  
     */
    PwbAlbum.prototype.setWaterFall = function() {
        // body...

        var $parent = this.getParentDomElements();
        var $boxes = this.getImageDomElements();
        $boxes.removeClass();
        $boxes.addClass('photoBox waterfall');
        var cols = _option.cols;
        //去除间距后的父元素宽度
        var parentW = $parent.width();
        
        var boxW = parentW / cols;
        $boxes.css("width",boxW).css("height", "auto");
        //数组存放当前各列的高度
        var hArr = []; 
        var getIndex = function(arr,val){
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    return i;
                };
            };
        }
        $boxes.each(function(n,ele){   
            if(n<cols){
                hArr.push($(ele).outerHeight()); 
            }
            else{
                var getminH = Math.min.apply(null,hArr);
                //得到当前最矮列的索引
                var index = getIndex(hArr,getminH);
                var left = index*boxW+"px";
                //将当前图片放到该列下
                $(ele).css("position","absolute").css("top",getminH+"px").css("left",left) ;
                //该列高度增加
                //console.log(getBox[i].offsetHeight);
                hArr[index] += $(ele).outerHeight();
            }
        })

    };

    /**
     * 设置木桶布局  
     */
     PwbAlbum.prototype.setBarrel = function() {
         // body...
        var self = this;
        var $boxes = this.getImageDomElements();
        var $parent =this.getParentDomElements();
        $boxes.removeClass();
        $boxes.addClass('photoBox');
        //box间距

        var parentW = $parent.width()-10;
        var maxRatio = parentW / _option.minH;
        var minRatio = parentW / _option.maxH;
        //临时容器存放当前行的图片
        var tempBox = [];
        //临时变量存放当前行的宽高比
        var tempRatio = 0;
        //当前行的高度
        var rowHeight;
        $boxes.each(function(n,ele){
            var boxRatio = $(ele).outerWidth() / $(ele).outerHeight();
            if(tempBox.length >= _option.minNum && tempRatio>minRatio){
                rowHeight = parentW / tempRatio;    
                self.barrelNewLine(tempBox,rowHeight);
                tempBox = [];
                tempRatio = 0;  
            }
            tempBox.push($(ele));
            tempRatio+=boxRatio;
        });
        //最后一行是否有剩余图片
        if(tempBox.length){
            if(tempRatio>minRatio){
                rowHeight = parentW / tempRatio;
                self.barrelNewLine(tempBox,rowHeight);
            }
            else{
                rowHeight = (_option.minH+_option.maxH) / 2;

                self.barrelNewLine(tempBox,rowHeight);
            }
            tempBox = [];
            tempRatio = 0;
        };




     };
     PwbAlbum.prototype.barrelNewLine = function(boxes,rowHeight) {
     
        var $parent = this.getParentDomElements();
        var boxW ;
        var boxGutter = 2*_option.gutter;
       
        var rowH = rowHeight - boxGutter;
        $parent.addClass('clear');
        for (var i = 0; i < boxes.length; i++) {
            /*console.log(boxes[i]);*/
            boxW = (boxes[i].width()*rowH/boxes[i].height());
             
            // console.log('height:'+boxes[i].height());

            boxes[i].css('height',rowH).css('width',boxW).css('float','left');
           $parent.append(boxes[i]);
        };
     };
    /**
     * 初始化并设置相册
     * 当相册原本包含图片时，该方法会替换原有图片
     * @param {(string|string[])} image  一张图片的 URL 或多张图片 URL 组成的数组
     * @param {object}            option 配置项
     */
    PwbAlbum.prototype.setImage = function (image, opts) {
        
        if (typeof image === 'string') {
            // 包装成数组处理
            this.setImage([image]);
            return;
        }
        $parent = this.getParentDomElements();
        $parent.empty();
        var self = this;
        var flag = true;
        _option.layout = opts.layout ;
        _option.gutter = opts.gutter ;
        _option.isFullscreen = opts.isFullscreen ;
        _option.cols = opts.cols ;
        _option.minH = opts.minH ;
        _option.maxH = opts.maxH ;
        _option.maxNum = opts.maxNum;
        _option.minNum = opts.minNum;
        _option.image = opts.images;
        _option.size = opts.size;
        this.addImage(image);
        $(window).load(function(){
            self.setLayout(self.getLayout());
            flag = false;
        });
        if(flag){
            self.setLayout(self.getLayout());
        }
        if(_option.isFullscreen){
            self.enableFullscreen(_option.image);
        }
        else{
            self.disableFullscreen();
        }
        // this.setLayout(_option.layout);

    };






    /**
     * 获取相册所有图像对应的 DOM 元素
     * 可以不是 ，而是更外层的元素
     * @return {HTMLElement[]} 相册所有图像对应的 DOM 元素组成的数组
     */
    PwbAlbum.prototype.getParentDomElements = function() {
    	var boxSelector = this.opts.boxSelector || "#puzzleContainer";
		var $parent = $('#'+boxSelector);
		return $parent;
    };
    PwbAlbum.prototype.getImageDomElements = function() {
        var boxSelector = this.opts.boxSelector || "puzzleContainer";
		var photoSelector = this.opts.photoSelector || "photoBox";
		var $boxes = $('#'+boxSelector+' .'+photoSelector);
		return $boxes;
    };



    /**
     * 向相册添加图片
     * 在拼图布局下，根据图片数量重新计算布局方式；其他布局下向尾部追加图片
     * @param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    PwbAlbum.prototype.addImage = function (image) {
        if (typeof image === 'string') {
            // 包装成数组处理
            this.addImage([image]);
            return;
        }
        var self=this;
        var $parent = this.getParentDomElements();
    	for (var i = 0; i < image.length; i++) {
            $parent.append("<div class='photoBox'><img src="+image[i]+".jpg></div>");
        };
        $(window).load(function(){
            self.setLayout(self.getLayout());
        });
        if(image.length==1){
            self.setLayout(self.getLayout());            
        }
    };



    /**
     * 移除相册中的图片
     * @param  {(HTMLElement|HTMLElement[])} image 需要移除的图片
     * @return {boolean} 是否全部移除成功
     */
    PwbAlbum.prototype.removeImage = function (image) {

    };	



    /**
     * 设置相册的布局
     * @param {number} layout 布局值，PwbAlbum.LAYOUT 中的值
     */
    PwbAlbum.prototype.setLayout = function (layout) {
        this.setGutter(this.opts.gutter);      
    	switch(this.getLayout()){
    		case 0:
                this.setSquare();
    			break;
    		case 1:
                this.setPuzzle();
    			break;
    		case 2:
                this.setWaterFall();
    			break;
    		case 3:
                this.setBarrel();
    			break;
    		default:
    			break;
    	}

    };



    /**
     * 获取相册的布局
     * @return {number} 布局枚举类型的值
     */
    PwbAlbum.prototype.getLayout = function() {
        return this.LAYOUT[_option.layout];
    };



    /**
     * 设置图片之间的间距
     * 注意这个值仅代表图片间的间距，不应直接用于图片的 margin 属性，如左上角图的左边和上边应该紧贴相册的左边和上边
     * 相册本身的 padding 始终是 0，用户想修改相册外框的空白需要自己设置相框元素的 padding
     * @param {number}  x  图片之间的横向间距
     * @param {number} [y] 图片之间的纵向间距，如果是 undefined 则等同于 x
     */
    PwbAlbum.prototype.setGutter = function (gutter) {
        var $boxes = this.getImageDomElements();
        $boxes.css('border-width',gutter+'px').css('border-style','solid').css('border-color','transparent');
    };



    /**
     * 允许点击图片时全屏浏览图片
     *@param {(string|string[])} image 一张图片的 URL 或多张图片 URL 组成的数组
     */
    PwbAlbum.prototype.enableFullscreen = function (image) {
        $('img').click(function(event){
            var tg = event.target;
            var url = $(tg).attr('src');
            /*var index = image.indexOf(url);*/
            var index;
            for (var i = 0; i < image.length; i++) {
                if (image[i]+".jpg" == url) {

                    index = i;
                    break;
                };
            };
            
            $('.fullPicture').attr('src',url); 
            $('.fullscreen').css('display','block');
            $('#next').click(function(){
                if(image[index] == image[index+1]){
                    return;
                }
                $('.fullPicture').attr('src',image[++index]);
            });
            $('#prev').click(function(){
                if(image[index] == image[index-1]){
                    return;
                }
                $('.fullPicture').attr('src',image[--index]);
               
            });
            $('.fullscreen').click(function(event){
                if(event.target!= $('#prev')[0]&&event.target!= $('#next')[0]){
                     $('.fullscreen').css('display','none');
    
                }
               
            });
        });
    };



    /**
     * 禁止点击图片时全屏浏览图片
     */
    PwbAlbum.prototype.disableFullscreen = function () {

    };



    /**
     * 获取点击图片时全屏浏览图片是否被允许
     * @return {boolean} 是否允许全屏浏览
     */
    PwbAlbum.prototype.isFullscreenEnabled = function () {

    };


    /**
     * 设置木桶模式每行图片数的上下限
     * @param {number} min 最少图片数（含）
     * @param {number} max 最多图片数（含）
     */
    PwbAlbum.prototype.setBarrelBin = function (min, max) {

        // 注意异常情况的处理，做一个健壮的库
        if (min === undefined || max === undefined || min > max) {
            console.error('...');
            return;
        }

        // 你的实现

    };



    /**
     * 获取木桶模式每行图片数的上限
     * @return {number} 最多图片数（含）
     */
    PwbAlbum.prototype.getBarrelBinMax = function () {

    };



    /**
     * 获取木桶模式每行图片数的下限
     * @return {number} 最少图片数（含）
     */
    PwbAlbum.prototype.getBarrelBinMin = function () {

    };



    /**
     * 设置木桶模式每行高度的上下限，单位像素
     * @param {number} min 最小高度
     * @param {number} max 最大高度
     */
    PwbAlbum.prototype.setBarrelHeight = function (min, max) {

    };



    /**
     * 获取木桶模式每行高度的上限
     * @return {number} 最多图片数（含）
     */
    PwbAlbum.prototype.getBarrelHeightMax = function () {

    };



    /**
     * 获取木桶模式每行高度的下限
     * @return {number} 最少图片数（含）
     */
    PwbAlbum.prototype.getBarrelHeightMin = function () {

    };



    // 你想增加的其他接口



    /************* 以上是本库提供的公有方法 *************/



    // 实例化





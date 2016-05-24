/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-05-23 21:38:42
 * @version $Id$
 */

function getRandomImg(argument) {
        var randomColor = ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
        var pWidth = Math.floor((Math.random() * 6 + 2) *100);
        var randomSize = Math.floor((Math.random() * 6 + 2) * 100 )+ 'X' +
            Math.floor((Math.random() * 5 + 2) * 100);
        var src = 'http://placehold.it/' + randomSize + '/' + randomColor + '/fff';
        return src;
}
var imgs = [];
for (var i = 0; i < 2; i++) {
    imgs.push(getRandomImg());
}
var options = {
    layout: 'SQUARE',
    isFullscreen:true,
    images:[],
    gutter:0,
    boxSelector:'puzzleContainer',
    photoSelector:'photoBox',
    cols:4,
    minH: 200,
    maxH: 400,
    minNum: 3,
    maxNum: 6,
    size: 100
}
options.images = imgs;
var pwbAlbum = new PwbAlbum(options);
pwbAlbum.setImage(imgs,options);
$('#fullscreen').change(function(){
    options.isFullscreen = $(this).val();

    pwbAlbum.setImage(imgs,options);
})
$('#addImage').click(function(){
    var url = $('#imgUrl').val();
    options.images.push(url);

    pwbAlbum.setImage(imgs,options);
    $('#imgUrl').val(getRandomImg());
    if(imgs.length>6&&options.layout=="PUZZLE"){
        $('#square').click();
    }
});
$('#Cols').change(function(){
    options.cols = $(this).val();
    pwbAlbum.setImage(imgs,options);
});
$('#square').click(function(){
    $('.gutterGroup').show();
    $('#albumType li').removeClass('active');
    $(this).addClass('active');
    $('.layoutConfigure').hide();
    $('#conSquare').show();
    options.layout = 'SQUARE';
    pwbAlbum.setImage(imgs,options);
})
$('#puzzle').click(function(){

    $('.gutterGroup').show();
    $('#albumType li').removeClass('active');
    $(this).addClass('active');
    $('.layoutConfigure').hide();
    $('#conPuzzle').show();
    options.layout = 'PUZZLE';
    if(imgs.length>6){
        alert('The PUZZLE only can include six pictures!')
        $('#square').click();
    }
    pwbAlbum.setImage(imgs,options);
})    
$('#waterfall').click(function(){
    $('.gutterGroup').show();
    $('#albumType li').removeClass('active');
    $(this).addClass('active');
    $('.layoutConfigure').hide();
    $('#conWaterfall').show();
    options.layout = 'WATERFALL';
    pwbAlbum.setImage(imgs,options);
})
$('#barrel').click(function(){
    $('#albumType li').removeClass('active');
    $(this).addClass('active');
    $('.layoutConfigure').hide();
    $('.gutterGroup').hide();
    $('#conBarrel').show();
    options.layout = 'BARREL';
    pwbAlbum.setImage(imgs,options);
})
$('#gutter').change(function(){
    if($(this).val()>50){
        alert('间距不能超过50！');
        $(this).val(50);
    }
    else if($(this).val()<0){
        alert('间距不能小于0！');
        $(this).val(0);
    }
    options.gutter = $(this).val();
    pwbAlbum.setImage(imgs,options);
})
$('#maxH').change(function(){
    options.maxH = $(this).val();
    pwbAlbum.setImage(imgs,options);
})
$('#minNum').change(function(){
    options.minNum = $(this).val();
    pwbAlbum.setImage(imgs,options);
})
$('#size').change(function(){
    if($(this).val()>300){
        alert('大小不能超过300！');
        $(this).val(300);
    }
    else if($(this).val()<50){
        alert('大小不能小于50！');
        $(this).val(50);
    }
    options.size = $(this).val();
    pwbAlbum.setImage(imgs,options);
})
$('#imgUrl').val(getRandomImg());
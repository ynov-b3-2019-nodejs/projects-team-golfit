class Button{
    constructor(x,y,width,height,img){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;
    }
    
    draw(){
        image(this.img,this.x,this.y,this.width,this.height);
    }
    
    isClicked(mouseX,mouseY){
        if(mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height){
            return true;
        }
        return false;
    }
}
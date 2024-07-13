export default function DisplayImg({imgData, clickHandler}){
    // console.log(imgData);
    return (
        <div className="imgContainer">
            <h2 className="btn" onClick={clickHandler}>Generate Image!</h2>
            <img src={imgData.urls.regular} alt="" />
            <h3>Photo by <a href={imgData.user.links.html}>{imgData.user.name}</a></h3>
        </div>
    )
}
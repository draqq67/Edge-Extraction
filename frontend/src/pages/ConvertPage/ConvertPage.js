
import "./ConvertPage.css"
export default function ConvertPage()
{
    return(
        <div className="convertContainer">
            <h1 className="convertTitle"> Convert your photo</h1>
            <div className="photos">
                <form className="send-photo">
                    <div className="file-upload">
                        <input type="file" />
                            <i className="fa fa-arrow-up"></i>
                    </div>
                    <button type="submit" className="filesubmit">Submit</button>
                    <div className="sendText">
                        Please Submit your photo
                    </div>
                </form>
                <div className="receivedphoto">
                        <img className="edgephoto" src="https://images.dog.ceo/breeds/akita/Akita_inu_blanc.jpg"></img>
                            <div className="downloadLink">
                                Link to Download
                        </div>
                </div>
            </div>
            </div>
    )
}
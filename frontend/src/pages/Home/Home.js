
import './Home.css'
export default function Home(){

    return(
        <div className='home'>
            <div className="home_text">
                <div className='home_title'>
                    Web application for extracting edges from photos
                </div>
                <div className="home_subtitle">
                    Made by Zarnescu Dragos, 321AC for Web Tehnology Class
                </div>
                <div className='doc'>
                    Documentatie
                </div>
                    <ul className='documentatie'>
                        <li className='etape'> 
                            Set-up proiect : 
                            <ul> 
                                <li>
                                    React.js pentru partea de frontend unde am toate paginiile pe care le voi afisa
                                </li>
                                <li>
                                    Express pentru partea de backend unde voi face apelurile api si algoritmul propriu-zis pentru detectare a marginilio
                                </li>
                            </ul>
                            </li>
                        <li className='etape'>
                            Paginile proiectului
                            <ul>
                                <li>
                                    Pagina de album unde voi avea o colectie de poze pe care algoritmul meu le genereaza
                                </li>
                                <li>
                                    O pagina in care un utilizator poate incarca o poza si sa ii trimita pe mail rezulatul
                                </li>
                            </ul>
                        </li>
                        <li className='etape'>
                            Etape Proiectului
                            <ol>
                                <li>
                                    Realizarea Lay-outului pagininilor folosind Html si CSS
                                </li>
                                <li>
                                    Adaugare de efecte javascript
                                </li>
                                <li>
                                    Realizarea Algoritmului de detectare a marginilor
                                    <ul>
                                        <li>
                                            Scoaterea imaginilor din api-ul dat
                                        </li>
                                        <li>
                                            Urmarirea pasilor de implementare din cerinta
                                        </li>
                                        <li>
                                            Realizarea Extractiei marginilor intr-o alta poza
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Realizarea albumului de poze cu poze luate din api-ul dat
                                </li>
                                <li>
                                    Realizarea paginii de convertire
                                    <ul>
                                        <li>
                                        Adaugarea pozelor direct in site
                                        </li>
                                        <li>
                                        Adaugarea functionalitatii de download/ trimitere a raspunsului pe mail
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        </li>
                    </ul>
                </div>
            </div>
    )

}
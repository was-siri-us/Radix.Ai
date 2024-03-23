import React, { useState } from 'react'
import UserNavbar from "components/Navbars/UserNavbar.js";
import Footer from 'components/Footer/Footer';
import axios from 'axios';



export default function Infering() {

  const [response1, setResponse1] = useState('');
  const [response2, setResponse2] = useState('');
  const [response3, setResponse3] = useState('');

  const [file, setFile] = useState(null);
  const [image, setImage] = useState('');
  const [predicting, setOut] = useState(false);
  const [predicted, setPredicted] = useState(false);
  const [prediction, setOutput] = useState('');
  const [convertedImg, setConvertedImg] = useState('');
  const [allredScore, setAllredScore] = useState(null);

  const [submit, setSubmit] = useState(false);
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [response, setResponse] = useState(false);


  const FileChange = (e) => {
    setOut(false);
    setPredicted(false);
    setConvertedImg('');
    const reader = new FileReader();
    const selectedFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(selectedFile);
      setImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    setSubmit(true);
    try {
      // Clear previous responses
      setResponse1('');
      setResponse2('');
      setResponse3('');

      const img = document.getElementById('image');
      const input = img.files[0];
      const formData = new FormData();
      formData.append('image', input);

      console.log(img);

      const [resp1, resp2, resp3] = await Promise.all([
        axios.post('https://optionally-relaxing-moose.ngrok-free.app/predict', formData, {
          responseType: 'blob',
        }),
        axios.post('https://optionally-relaxing-moose.ngrok-free.app/process_image', formData, {
          responseType: 'blob',
        }),
        axios.post('https://barely-ruling-whale.ngrok-free.app/upload', formData),
      ]);

      setResponse1(URL.createObjectURL(resp1.data));
      setA(true);
      setResponse2(URL.createObjectURL(resp2.data));
      setB(true);
      setResponse3(resp3.data.Predicted);
      setC(true);
    } catch (error) {
      console.error('Error:', error);
    }

    console.log(a);
    console.log(b);
    console.log(c);

    // if(a && b && c){
    setResponse(true);
    setSubmit(false);
    // }

  };


  return (<>
    <UserNavbar />
    <div className="section" id="basic-elements">
      <img alt="..." className="path" src={require("assets/img/path1.png")} />
      <br/>
      <div className=''>
        <h1>
          <center>
            Radiology Report generation
          </center>
        </h1>
      </div>
      {/* <div className="container h-screen  mx-auto">
        <div class="flex p-3 flex-auto mx-auto h-screen  flex-row">
          <div class="xl:basis-1/3 lg:basis-2/3 md:basis-8/12 basis-full mx-auto h-fit self-center drop-shadow-xl rounded-md border border-purple-600 p-6">
            <h4 class="text-xl text-center font-bold text-gray-500 pt-4">Tailwind Login Page</h4>
            <div className="text-xl text-center pb-5 font-bold text-gray-500">
             
            </div>
          </div>
        </div>
      </div> */}

      {!submit && !response && (
        <div class="container ">
          <div class="flex p-3 flex-auto mx-auto  flex-row">
            <div class="xl:basis-1/3 lg:basis-2/3 md:basis-8/12 basis-full mx-auto h-fit self-center drop-shadow-xl rounded-md border border-red-900 p-6">
              <h4 class="text-xl text-center  font-bold text-gray-500">Upload X-Ray Image</h4>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-center pb-4">
                  <input
                    className="p-2 block w-full text-sm text-gray-100 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
                    id="image"
                    type="file"
                    onChange={FileChange}
                  />
                </div>

                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>

              </form>
            </div>
          </div>
        </div>
      )}

      {submit && (
        <center>
          <div role="status">
            <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </center>
      )}

    </div>

    {response && (
      <>
        {/* {response1 && (
        <div>
          <h5>Response 1:</h5>
          <img src={response1} alt="Processed" />
        </div>
      )}
      {response2 && (
        <div>
          <h5>Response 2:</h5>
          <img src={response2} alt="Processed" />
        </div>
      )}
      {Object.keys(response3).length > 0 && (
        <div>
          <h5>Response 3:</h5>
          <pre>{JSON.stringify(response3, null, 2)}</pre>
        </div>
      )} */}
        <center>
          {response1 && (
            <div className="mt-4">
              <h3 className="font-bold">Disease Probability Graph:</h3>
              <img src={response1} alt="Processed" className="mt-2 rounded-lg shadow-md" />
            </div>
          )}
          {response2 && (
            <div className="mt-4">
              <h3 className="font-bold">Anomly Locallization:</h3>
              <img src={response2} alt="Processed" className="mt-2 rounded-lg shadow-md" />
            </div>
          )}
          {Object.keys(response3).length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold">AI Generated Text Report("Experimental"):</h3>
              <pre className="mt-2 p-4 rounded-lg shadow-md text-base">{response3}</pre>
            </div>
          )}
        </center>

      </>
    )}


  </>
  )
}



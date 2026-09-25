import { useEffect, useState} from 'react';
import axios from 'axios';

const Gallery = () => {
    //upload form fields
    const [photos, setPhotos] = useState(null);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [refresh, setRefresh] = useState(true);

    //retrieve photos on component mount or when refresh is true
    useEffect(() => {
        const fetchPhotos = async () => {
            try {

                //Retrieve token from localstorage or other secure storage
                const token = localStorage.getItem('token');

                //make get request to the photos route
                const response = await axios.get('/api/photos', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in the header
                    },
                });

                console.log(response.data);
                //set the photos from the response
                setPhotos(response.data);

            }catch (error) {
                setError('You are not authorized to view the posts.');
            }
        };

        if(refresh){
          console.log("triggered", refresh);
          fetchPhotos();
          setRefresh(false);
        }
    }, [refresh]);

    //render photos in a grid
    const photoGrid = () => {
        const rows = photos?.map(photo =>

          <div key={photo._id} className="card bg-base-100 shadow-xl">
          <figure>
            <img src={photo.imageUrl} alt={photo.title} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{photo.title}</h2>
            <p>{photo.description}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-sm btn-error" onClick={() => deletePhoto(photo._id)}>Delete</button>
            </div>
          </div>
          </div>
        );

        return rows;
    };

    //function to delete a photo
    const deletePhoto = async (photoId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/photos/${photoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the header
                },
            });
            // Refresh the gallery after deletion
            setRefresh(true);
        }catch (err) {
          console.log(err);
          if (err.response)
          {
              setError(err.response.data.message);
          }
          else {
              setError('Something went wrong. Please try again.');
          }
        }
    };

    //function to handle photo upload
    const uploadPhoto = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log(e.target.photo.files[0]);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            // Append the file and other fields to the FormData object
            //note the name attribute of the image in form must match the backend i.e 'image'
            formData.append('image', e.target.photo.files[0]);
            formData.append('title', title);
            formData.append('description', description);

            const response = await axios.post('/api/photos', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            });

            // reset form fields and refresh gallery
            setTitle('');
            setDescription('');
            e.target.reset();
            setRefresh(true);
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    //return upload form
    const uploadForm = () => {
      return (<div className="card w-full max-w-xl mx-auto mb-8 shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Upload a Photo</h2>
          <form onSubmit={uploadPhoto} encType="multipart/form-data">
            <div className="form-control mb-2">
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="input input-bordered w-full"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-2">
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="input input-bordered w-full"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <input type="file" accept="image/*" name="photo" className="file-input file-input-bordered w-full" required />
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary">Upload</button>
            </div>
          </form>
        </div>
      </div>)
    }

    return (
      <>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {/*<!-- Upload Form -->*/}
        {uploadForm()}
        {/*<!-- Photo Gallery -->*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photoGrid()}
        </div>
      </>);
};

export default Gallery;

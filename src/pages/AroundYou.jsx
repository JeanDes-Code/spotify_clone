import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const AroundYou = () => {
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);

  useEffect(() => {
    axios
      .get(
        `https://geo.ipify.org/api/v2/country?apiKey=at_iTvyiIYP5l9oGmOfUPd5osrb07t9U`,
      )
      .then((res) => setCountry(res?.data?.location?.country))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [country]);

  if (isFetching && loading) {
    return (
      <Loader title="Recherche des titres populaires dans votre Pays..." />
    );
  }

  if (error && country !== '') return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Dans votre Pays <span className="font-black"> {country} </span>
      </h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {country === 'FR' && (
          <p className="font-bold text-xl text-gray-300 text-left mt-4 mb-10">
            <span className="font-black">INFO :</span> Votre Pays n'autorise
            malheureusement pas la diffusion gratuite d'extraits musicaux ...
          </p>
        )}
        {data?.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
            country={country}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;

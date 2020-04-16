import React from 'react';
import { connect } from 'react-redux';
import { MovieCard } from '../movie-card/movie-card';
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import './movie-list.scss';

const mapStateToProps = state => {
    const { visibilityFilter } = state;
    return { visibilityFilter };
};

export function MovieList(props) {
    const { movies, visibilityFilter } = props;
    let filteredMovies = movies;

    return (
        <div className='movie-list'>
            {props.movies.length
                ?
                props.movies.map(m => {
                    return <MovieCard key={m._id} movie={m} showOpen={true} />;
                })
                :
                <div>No Movies</div>
            }
        </div>
    )
}

// function MoviesList(props) {
//     const { movies, visibilityFilter } = props;
//     let filteredMovies = movies;
  
//     if (visibilityFilter !== '') {
//       filteredMovies = movies.filter(m => m.Title.includes(visibilityFilter));
//     }
  
//     if (!movies) return <div className="main-view"/>;
  
//     return filteredMovies.map(m => <MovieCard key={m._id} movie={m}/>);
//   }
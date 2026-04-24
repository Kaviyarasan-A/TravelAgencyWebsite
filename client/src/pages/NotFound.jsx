import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
    return (
        <>
            <Helmet><title>Page Not Found | Trip with uz</title></Helmet>
            <section className="min-h-[70vh] flex items-center">
                <div className="container-x text-center">
                    <div className="font-display text-[140px] leading-none font-extrabold gradient-text">404</div>
                    <h1 className="font-display text-3xl font-bold mt-2">This destination is off the map.</h1>
                    <p className="text-ink-muted mt-3 max-w-lg mx-auto">
                        The page you're looking for doesn't exist or has moved. Let's get you back on route.
                    </p>
                    <div className="mt-6 flex gap-3 justify-center">
                        <Link to="/" className="btn-primary"><FiHome /> Go home</Link>
                        <button onClick={() => history.back()} className="btn-outline"><FiArrowLeft /> Go back</button>
                    </div>
                </div>
            </section>
        </>
    );
}

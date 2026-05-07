import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';

const Home          = lazy(() => import('./pages/Home.jsx'));
const Packages      = lazy(() => import('./pages/Packages.jsx'));
const PackageDetail = lazy(() => import('./pages/PackageDetail.jsx'));
const StudyAbroad   = lazy(() => import('./pages/StudyAbroad.jsx'));
const BusinessSetup = lazy(() => import('./pages/BusinessSetup.jsx'));
const About         = lazy(() => import('./pages/About.jsx'));
const Contact       = lazy(() => import('./pages/Contact.jsx'));
const Careers       = lazy(() => import('./pages/Careers.jsx'));
const Terms         = lazy(() => import('./pages/Terms.jsx'));
const Privacy       = lazy(() => import('./pages/Privacy.jsx'));
const NotFound      = lazy(() => import('./pages/NotFound.jsx'));
const Admin         = lazy(() => import('./pages/Admin.jsx'));
const Blog          = lazy(() => import('./pages/Blog.jsx'));
const BlogDetail    = lazy(() => import('./pages/BlogDetail.jsx'));
const Quotation     = lazy(() => import('./pages/Quotation.jsx'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail.jsx'));

function PageFallback() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-14 h-14 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/admin" element={<Suspense fallback={<PageFallback />}><Admin /></Suspense>} />
            <Route element={<Layout />}>
                <Route index element={<Suspense fallback={<PageFallback />}><Home /></Suspense>} />
                <Route path="/packages" element={<Suspense fallback={<PageFallback />}><Packages /></Suspense>} />
                <Route path="/packages/:slug" element={<Suspense fallback={<PageFallback />}><PackageDetail /></Suspense>} />
                <Route path="/study-abroad" element={<Suspense fallback={<PageFallback />}><StudyAbroad /></Suspense>} />
                <Route path="/business-setup" element={<Suspense fallback={<PageFallback />}><BusinessSetup /></Suspense>} />
                <Route path="/blog" element={<Suspense fallback={<PageFallback />}><Blog /></Suspense>} />
                <Route path="/blog/:slug" element={<Suspense fallback={<PageFallback />}><BlogDetail /></Suspense>} />
                <Route path="/quotation/:id" element={<Suspense fallback={<PageFallback />}><Quotation /></Suspense>} />
                <Route path="/destinations/:slug" element={<Suspense fallback={<PageFallback />}><DestinationDetail /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={<PageFallback />}><About /></Suspense>} />
                <Route path="/contact" element={<Suspense fallback={<PageFallback />}><Contact /></Suspense>} />
                <Route path="/careers" element={<Suspense fallback={<PageFallback />}><Careers /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<PageFallback />}><Terms /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<PageFallback />}><Privacy /></Suspense>} />
                <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
            </Route>
        </Routes>
    );
}

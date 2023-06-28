import Link from 'next/link';
import NavBar from '../../components/NavBar';
import Form from './components/Form';
import Header from './components/Header';

export default function Reserve() {
    return (
        <div className="border-t h-screen">
            <div className="py-9 w-3/5 m-auto">
                {/* HEADER */}
                <Header />
                {/* HEADER */} {/* FORM */}
                <Form />
            </div>
        </div>

    )
}
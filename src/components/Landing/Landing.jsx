import React from 'react';
import { BsCheckCircleFill, BsCircle, BsLightningChargeFill, BsArrowRight } from 'react-icons/bs';
import { MdViewColumn, MdCheckCircle, MdSync, MdDevices, MdLock } from 'react-icons/md';
import { goToLogin } from '@killerkc12/shared';
import './Landing.css';

// Public marketing page for signed-out visitors. Sign-in buttons go to auth.killerkc12.in.

const columns = [
    { name: 'To do', tasks: [['Plan weekend trip', false], ['Renew passport', false], ['Book dentist', false]] },
    { name: 'This week', tasks: [['Finish API review', false], ['Gym x3', false]] },
    { name: 'Done', tasks: [['Pay electricity bill', true], ['Grocery run', true]] },
];

const features = [
    { icon: MdViewColumn, title: 'Lists side by side', text: 'Split your board into lists like To do, This week or Shopping, and see everything at a glance.' },
    { icon: BsLightningChargeFill, title: 'Add tasks in a second', text: 'Type and press Enter. No forms, no fields you have to fill in.' },
    { icon: MdCheckCircle, title: 'Tick off and tidy up', text: 'Completed tasks fold away into their own section so your list stays clean.' },
    { icon: MdSync, title: 'Always in sync', text: 'Changes save instantly and show up live on every device you are signed in on.' },
    { icon: MdDevices, title: 'Works on any screen', text: 'Use it on your laptop at work and your phone on the go.' },
    { icon: MdLock, title: 'Private to you', text: 'Your boards are only visible to your account. Nobody else can read them.' },
];

const LINKS = [
    ['More projects', 'https://killerkc12.in/'],
    ['GitHub', 'https://github.com/killerkc12'],
    ['LinkedIn', 'https://www.linkedin.com/in/killerkc12/'],
    ['YouTube', 'https://www.youtube.com/channel/UCAmdURTMLgwCJuiswA9P2Gg/'],
];

const steps = [
    ['Sign in with Google', 'One free account for every killerkc12.in app.'],
    ['Make your lists', 'Start with To do, add whatever lists suit you.'],
    ['Add and tick off', 'Type a task, press Enter, tick it when done.'],
];

const Landing = () => (
    <div className='landing'>
        <nav className='landing__nav'>
            <span className='landing__brand'><span className='landing__mark'><BsCheckCircleFill /></span>TaskBoard</span>
            <div className='landing__navlinks'>
                <a href='#features'>Features</a>
                <a href='#how'>How it works</a>
                <button className='landing__btn landing__btn--ghost' onClick={goToLogin}>Sign in</button>
            </div>
        </nav>

        <header className='landing__hero'>
            <div className='landing__copy'>
                <p className='landing__kicker'>Free · Simple · Synced</p>
                <h1>Your tasks, organised into lists you can see at a glance</h1>
                <p className='landing__lead'>
                    TaskBoard is a clean, fast task board. Make lists, add tasks with a keystroke,
                    tick them off, and pick up where you left off on any device.
                </p>
                <div className='landing__ctas'>
                    <button className='landing__btn' onClick={goToLogin}>Get started free <BsArrowRight /></button>
                    <a href='#features' className='landing__link'>See features</a>
                </div>
            </div>

            <div className='landing__board' aria-label='Example board'>
                {columns.map((c) => (
                    <div className='landing__col' key={c.name}>
                        <p className='landing__colname'>{c.name}</p>
                        {c.tasks.map(([t, done]) => (
                            <div className={`landing__task${done ? ' is-done' : ''}`} key={t}>
                                {done ? <BsCheckCircleFill className='landing__tick' /> : <BsCircle className='landing__tick' />}
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                ))}
                <p className='landing__note'>Example board</p>
            </div>
        </header>

        <section id='features' className='landing__features'>
            <h2>Everything you need, nothing you don't</h2>
            <div className='landing__grid'>
                {features.map(({ icon: Icon, title, text }) => (
                    <div className='landing__feature' key={title}>
                        <span className='landing__icon'><Icon /></span>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </div>
                ))}
            </div>
        </section>

        <section id='how' className='landing__how'>
            <h2>Start in under a minute</h2>
            <div className='landing__steps'>
                {steps.map(([title, text], i) => (
                    <div className='landing__step' key={title}>
                        <span className='landing__num'>{i + 1}</span>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </div>
                ))}
            </div>
        </section>

        <section className='landing__final'>
            <h2>Clear your head. Start a board.</h2>
            <p>Sign in with Google. One account works across all killerkc12.in apps.</p>
            <button className='landing__btn' onClick={goToLogin}>Get started free <BsArrowRight /></button>
        </section>

        <footer className='landing__footer'>
            <span>TaskBoard by killerkc12</span>
            <span>
                {LINKS.map(([label, href]) => (
                    <a key={label} href={href} target={href.includes('killerkc12.in') ? undefined : '_blank'} rel='noopener noreferrer'>{label}</a>
                ))}
            </span>
            <p className='landing__privacy'>Privacy-friendly analytics (PostHog) to count visits. No cookies, no ads.</p>
        </footer>
    </div>
);

export default Landing;

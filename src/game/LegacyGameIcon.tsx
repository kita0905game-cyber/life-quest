import { useId, type ReactNode } from 'react';

export type IconName = 'stone' | 'wood' | 'ironOre' | 'copperOre' | 'crystal' | 'ironIngot' | 'copperIngot' | 'gear' | 'lantern' | 'chest' | 'gold' | 'bait' | 'ticket' | 'fish' | 'energy' | 'xp' | 'town' | 'mine' | 'workshop' | 'fishing' | 'explore' | 'collection' | 'records' | 'boss' | 'book' | 'lock' | 'forest' | 'mountain' | 'ruins' | 'station' | 'train' | 'master';

type Props = { name: IconName; size?: number; label?: string; className?: string };

function GameIcon({ name, size = 28, label, className = '' }: Props) {
    const uid = useId().replace(/:/g, '');
    const gold = `${uid}-gold`;
    const metal = `${uid}-metal`;
    const blue = `${uid}-blue`;
    const copper = `${uid}-copper`;
    let art: ReactNode;

    const materialKeys = ['stone', 'ironOre', 'copperOre', 'wood', 'crystal', 'ironIngot', 'copperIngot', 'gear', 'lantern'];
    const materialIndex = materialKeys.indexOf(name);
    if (materialIndex >= 0) {
        return <span className={`lq-game-icon qw-material-art ${className}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{
            width: size, height: size, display: 'inline-block', flexShrink: 0,
            backgroundImage: 'url(./art/material-atlas-crafted-v1.webp)',
            backgroundSize: '300% 300%',
            backgroundPosition: `${(materialIndex % 3) * 50}% ${Math.floor(materialIndex / 3) * 50}%`,
            borderRadius: '12%',
        }} />;
    }

    switch (name) {
        case 'stone':
            art = <><path d='M13 43 19 19l19-9 14 15-5 23-23 7Z' fill='#8c9293' stroke='#343b3d' strokeWidth='3'/><path d='m19 19 15 10 18-4M34 29l-10 26M34 29l4-19' fill='none' stroke='#c9cece' strokeWidth='2' opacity='.75'/></>;
            break;
        case 'wood':
            art = <><path d='M12 22h39v22H12z' fill='#8a562f' stroke='#3f291d' strokeWidth='3'/><ellipse cx='12' cy='33' rx='7' ry='11' fill='#b8773e' stroke='#3f291d' strokeWidth='3'/><ellipse cx='51' cy='33' rx='7' ry='11' fill='#a86738' stroke='#3f291d' strokeWidth='3'/><circle cx='12' cy='33' r='4' fill='none' stroke='#6d4328' strokeWidth='2'/><path d='M21 26h23M21 34h18M23 41h21' stroke='#d39b65' strokeWidth='2' opacity='.65'/></>;
            break;
        case 'ironOre':
            art = <><path d='m11 44 8-26 19-9 16 16-7 25-24 5Z' fill='#434b55' stroke='#1e252d' strokeWidth='3'/><path d='m19 18 16 12 19-5M35 30 23 55M35 30l3-21' fill='none' stroke='#8fa0b4' strokeWidth='2'/><circle cx='25' cy='28' r='3' fill='#b8c6d4'/><circle cx='42' cy='39' r='4' fill='#7f91a4'/></>;
            break;
        case 'copperOre':
            art = <><path d='m11 44 8-26 19-9 16 16-7 25-24 5Z' fill='#9a4e2f' stroke='#4c2c23' strokeWidth='3'/><path d='m19 18 16 12 19-5M35 30 23 55M35 30l3-21' fill='none' stroke='#e7a16d' strokeWidth='2'/><circle cx='24' cy='29' r='3' fill='#ffbc78'/><circle cx='43' cy='39' r='4' fill='#cb7045'/></>;
            break;
        case 'crystal':
            art = <><path d='m31 6 10 15-5 35H21l-3-31Z' fill={`url(#${blue})`} stroke='#27629c' strokeWidth='2.5'/><path d='m31 6 1 50M18 25l14 7 9-11M21 56l11-24 4 24' fill='none' stroke='#c9f4ff' strokeWidth='2' opacity='.85'/><path d='m13 31 8-12 7 13-7 24Z' fill='#4fc6ee' stroke='#27629c' strokeWidth='2'/><path d='m43 28 8-9 5 13-9 22Z' fill='#45aee5' stroke='#27629c' strokeWidth='2'/></>;
            break;
        case 'ironIngot':
            art = <><path d='m9 38 8-18h31l7 18-8 11H17Z' fill={`url(#${metal})`} stroke='#4d5862' strokeWidth='3'/><path d='M17 20 26 31h29M26 31l-9 18' fill='none' stroke='#eef4f8' strokeWidth='2' opacity='.8'/></>;
            break;
        case 'copperIngot':
            art = <><path d='m9 38 8-18h31l7 18-8 11H17Z' fill={`url(#${copper})`} stroke='#6b3728' strokeWidth='3'/><path d='M17 20 26 31h29M26 31l-9 18' fill='none' stroke='#ffd0a6' strokeWidth='2' opacity='.75'/></>;
            break;
        case 'gear':
            art = <><path d='M27 7h10l2 8 7 3 7-4 7 8-6 6 1 8 7 4-4 10-8-2-6 6v8H32l-2-8-7-3-7 4-7-8 6-6-1-8-7-4 4-10 8 2 6-6Z' fill={`url(#${metal})`} stroke='#47515b' strokeWidth='2.5'/><circle cx='32' cy='34' r='11' fill='#29333b' stroke='#d4dce0' strokeWidth='3'/></>;
            break;
        case 'lantern':
            art = <><path d='M23 16h18l5 9-4 27H22l-4-27Z' fill='#4b3b2a' stroke='#231d18' strokeWidth='3'/><path d='M24 27h16l-2 20H26Z' fill='#f5bf4f' stroke='#8e5f20' strokeWidth='2'/><path d='M25 16c0-10 14-10 14 0' fill='none' stroke='#b68b4d' strokeWidth='3'/><path d='M27 30 37 45M38 30 27 45' stroke='#fff0a0' strokeWidth='2' opacity='.6'/></>;
            break;
        case 'chest':
            art = <><path d='M9 29h46v26H9Z' fill='#8a4c25' stroke='#3c261c' strokeWidth='3'/><path d='M11 29c1-13 9-19 21-19s20 6 21 19Z' fill='#b56d31' stroke='#3c261c' strokeWidth='3'/><path d='M29 10h7v45h-7ZM9 36h46' fill='#e0a43b' stroke='#8c5a20' strokeWidth='2'/><rect x='27' y='31' width='10' height='13' rx='2' fill='#f0cf66' stroke='#6f4d1e' strokeWidth='2'/></>;
            break;
        case 'gold':
            art = <><circle cx='32' cy='32' r='24' fill={`url(#${gold})`} stroke='#7c5418' strokeWidth='3'/><circle cx='32' cy='32' r='17' fill='none' stroke='#fff0a1' strokeWidth='2' opacity='.65'/><path d='m32 19 4 9 10 1-8 6 3 10-9-5-9 5 3-10-8-6 10-1Z' fill='#8c5c17' opacity='.85'/></>;
            break;
        case 'bait':
            art = <><path d='M13 36c5-16 21-20 29-8 7 11-3 22-13 17-8-4-4-14 4-14 7 0 12 8 7 14-4 6-15 9-24 4' fill='none' stroke='#c95e4f' strokeWidth='7' strokeLinecap='round'/><circle cx='15' cy='36' r='3' fill='#f4aa8d'/><circle cx='18' cy='31' r='1.5' fill='#532b2a'/></>;
            break;
        case 'ticket':
            art = <><path d='M10 19h44v27c-5 0-7 8-1 10H11c6-2 4-10-1-10Z' fill='#d8bd83' stroke='#5f4b2f' strokeWidth='3'/><path d='M20 25h24M20 40h24' stroke='#8b7046' strokeWidth='2' strokeDasharray='3 3'/><circle cx='32' cy='33' r='7' fill='none' stroke='#6a5637' strokeWidth='2'/><path d='m32 24 2 7 6 2-6 2-2 7-2-7-6-2 6-2Z' fill='#6a5637'/></>;
            break;
        case 'fish':
            art = <><path d='M12 33c9-14 27-17 38-5l8-7-2 15 2 12-9-6c-11 11-28 7-37-9Z' fill='#4f9fc7' stroke='#24556f' strokeWidth='3'/><path d='M20 29c10-7 19-7 28 0' fill='none' stroke='#bdefff' strokeWidth='2'/><circle cx='23' cy='32' r='2.5' fill='#132d38'/><path d='M34 20 28 11l12 5Z' fill='#2f789d' stroke='#24556f' strokeWidth='2'/></>;
            break;
        case 'energy':
            art = <><path d='m35 5-19 30h14l-3 24 21-34H34Z' fill='#f2c34c' stroke='#8c641d' strokeWidth='3'/><path d='m35 13-9 16h9' fill='none' stroke='#fff1a6' strokeWidth='3' strokeLinecap='round'/></>;
            break;
        case 'xp':
            art = <><circle cx='32' cy='32' r='24' fill='#3c78c3' stroke='#183c6d' strokeWidth='3'/><path d='m32 15 5 11 12 2-9 8 3 13-11-7-11 7 3-13-9-8 12-2Z' fill='#d8efff'/></>;
            break;
        case 'town':
            art = <><path d='M7 33 20 21l10 8 13-16 14 17v25H7Z' fill='#8a5d37' stroke='#3f2d25' strokeWidth='3'/><path d='M20 21v34M43 13v42' stroke='#dba869' strokeWidth='3'/><rect x='26' y='40' width='12' height='15' fill='#f2ce75'/></>;
            break;
        case 'mine':
            art = <><path d='M8 53 20 17h24l12 36Z' fill='#46514c' stroke='#25302c' strokeWidth='3'/><path d='M20 52c0-17 24-17 24 0' fill='#111918'/><path d='M17 32h30M22 19l7 13M42 19l-7 13' stroke='#7d5b39' strokeWidth='4'/></>;
            break;
        case 'workshop':
            art = <><path d='M12 53V28l20-14 20 14v25Z' fill='#8c5f43' stroke='#443126' strokeWidth='3'/><path d='M22 53V35h20v18M43 17V7h8v16' stroke='#e0aa70' strokeWidth='3'/><circle cx='32' cy='40' r='7' fill='#c2c7c8' stroke='#4d565b' strokeWidth='2'/></>;
            break;
        case 'fishing':
            art = <><path d='M13 52c3-25 16-39 31-40' fill='none' stroke='#9e6a39' strokeWidth='4' strokeLinecap='round'/><path d='M44 12c10 8 8 18 3 26' fill='none' stroke='#d8e3e7' strokeWidth='2'/><circle cx='47' cy='41' r='4' fill='#d9524f' stroke='#fff' strokeWidth='2'/><path d='M18 50c8-7 20-7 27 0' fill='none' stroke='#3b8ba9' strokeWidth='4'/></>;
            break;
        case 'explore':
            art = <><circle cx='32' cy='32' r='24' fill='#d2b77b' stroke='#59472f' strokeWidth='3'/><circle cx='32' cy='32' r='16' fill='none' stroke='#7b6542' strokeWidth='2'/><path d='m38 18-4 13-13 8 9-12Z' fill='#c65d43' stroke='#65372e' strokeWidth='2'/><path d='m26 46 4-13 13-8-9 12Z' fill='#f0df9a' stroke='#6a593c' strokeWidth='2'/></>;
            break;
        case 'collection':
            art = <><rect x='11' y='13' width='42' height='40' rx='4' fill='#6b4f35' stroke='#30251d' strokeWidth='3'/><path d='M18 20h13v12H18zM35 20h11v12H35zM18 36h13v10H18zM35 36h11v10H35z' fill='#d7be84'/></>;
            break;
        case 'records':
            art = <><path d='M13 53V25l19-14 19 14v28Z' fill='#d7c291' stroke='#5a4930' strokeWidth='3'/><path d='M9 26h46M18 27v21M32 27v21M46 27v21M9 51h46' stroke='#7f6944' strokeWidth='3'/><path d='m32 15 4 6h-8Z' fill='#b58a3b'/></>;
            break;
        case 'boss':
            art = <><path d='M13 48c2-19 8-30 19-36 12 5 19 18 20 36-10 9-29 9-39 0Z' fill='#752f35' stroke='#351a20' strokeWidth='3'/><path d='m19 20-9-8 3 16M45 19l9-8-3 17' fill='#8d4a42' stroke='#351a20' strokeWidth='3'/><circle cx='24' cy='33' r='3' fill='#ffc857'/><circle cx='40' cy='33' r='3' fill='#ffc857'/><path d='m25 45 7 5 7-5' fill='none' stroke='#e2a48c' strokeWidth='2'/></>;
            break;
        case 'book':
            art = <><path d='M8 17c11-5 19-2 24 3v33c-7-6-15-7-24-4ZM56 17c-11-5-19-2-24 3v33c7-6 15-7 24-4Z' fill='#e0c68c' stroke='#5b4930' strokeWidth='3'/><path d='M32 20v33' stroke='#8d7148' strokeWidth='2'/></>;
            break;
        case 'lock':
            art = <><rect x='14' y='29' width='36' height='27' rx='5' fill='#5b6267' stroke='#282e32' strokeWidth='3'/><path d='M21 29v-8c0-15 22-15 22 0v8' fill='none' stroke='#9da6aa' strokeWidth='5'/><circle cx='32' cy='42' r='4' fill='#d5ba67'/></>;
            break;
        case 'forest':
            art = <><path d='m18 49 12-17h-7l11-20 11 20h-7l11 17Z' fill='#4f7d4b' stroke='#294b31' strokeWidth='3'/><path d='M34 47v11' stroke='#69452d' strokeWidth='5'/><path d='m5 53 9-14 8 14Z' fill='#6d9658'/></>;
            break;
        case 'mountain':
            art = <><path d='M5 53 26 15l10 17 7-10 16 31Z' fill='#71808a' stroke='#35434b' strokeWidth='3'/><path d='m19 28 7-13 8 14-7-3Z' fill='#e7edf0'/><path d='m37 31 6-9 6 12-6-2Z' fill='#dbe5e9'/></>;
            break;
        case 'ruins':
            art = <><path d='M12 53V24h40v29M19 24V13h9v11M37 24V9h10v15' fill='#786d5c' stroke='#3e3931' strokeWidth='3'/><path d='M12 34h40M27 34v19M42 34v19' stroke='#b2a38a' strokeWidth='2'/><path d='m31 13 5 7' stroke='#3e3931' strokeWidth='3'/></>;
            break;
        case 'station':
            art = <><path d='M9 51V25l23-13 23 13v26Z' fill='#8d6846' stroke='#423226' strokeWidth='3'/><path d='M16 31h32M23 31v20M41 31v20' stroke='#e0b576' strokeWidth='3'/><rect x='26' y='38' width='12' height='13' fill='#33404a'/><path d='M6 56h52M11 60h42' stroke='#8a8f91' strokeWidth='3'/></>;
            break;
        case 'train':
            art = <><rect x='9' y='14' width='46' height='34' rx='7' fill='#315d68' stroke='#19343b' strokeWidth='3'/><rect x='15' y='20' width='14' height='12' rx='2' fill='#b8d9dd'/><rect x='35' y='20' width='14' height='12' rx='2' fill='#b8d9dd'/><path d='M10 39h44M17 48l-5 8M47 48l5 8M15 56h34' stroke='#d2a453' strokeWidth='3'/><circle cx='20' cy='48' r='5' fill='#1e272b'/><circle cx='44' cy='48' r='5' fill='#1e272b'/></>;
            break;
        case 'master':
            art = <><path d='m32 6 8 16 18 3-13 13 3 19-16-9-16 9 3-19L6 25l18-3Z' fill={`url(#${gold})`} stroke='#765017' strokeWidth='3'/><circle cx='32' cy='32' r='8' fill='#fff0a3' opacity='.7'/></>;
            break;
        default:
            art = <circle cx='32' cy='32' r='20' fill='#8c9498'/>;
    }

    return (
        <svg className={`lq-game-icon ${className}`} width={size} height={size} viewBox='0 0 64 64' role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
            <defs>
                <linearGradient id={gold} x1='0' y1='0' x2='1' y2='1'><stop stopColor='#fff09c'/><stop offset='.48' stopColor='#e4b13f'/><stop offset='1' stopColor='#a96b18'/></linearGradient>
                <linearGradient id={metal} x1='0' y1='0' x2='1' y2='1'><stop stopColor='#f3f6f7'/><stop offset='.5' stopColor='#9ca8ae'/><stop offset='1' stopColor='#58646c'/></linearGradient>
                <linearGradient id={blue} x1='0' y1='0' x2='1' y2='1'><stop stopColor='#d9fbff'/><stop offset='.45' stopColor='#59cfee'/><stop offset='1' stopColor='#3473d3'/></linearGradient>
                <linearGradient id={copper} x1='0' y1='0' x2='1' y2='1'><stop stopColor='#ffd3ad'/><stop offset='.45' stopColor='#c97345'/><stop offset='1' stopColor='#7a3828'/></linearGradient>
            </defs>
            {art}
        </svg>
    );
}

export type FishIconName = 'medaka' | 'funa' | 'koi' | 'bass' | 'aji' | 'saba' | 'tai' | 'salmon' | 'eel' | 'kingyo' | 'rainbowTrout' | 'moonKoi';

type FishIconProps = { fish: FishIconName; size?: number; className?: string; label?: string };

export function FishIcon({ fish, size = 64, className = '', label }: FishIconProps) {
    const keys: FishIconName[] = ['medaka', 'funa', 'koi', 'bass', 'aji', 'saba', 'tai', 'salmon', 'eel', 'kingyo', 'rainbowTrout', 'moonKoi'];
    const index = keys.indexOf(fish);
    return <span className={`lq-fish-icon qw-fish-art ${className}`} data-fish={fish}
        role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
        style={{
            width: size, height: size, display: 'inline-block', flexShrink: 0,
            backgroundImage: 'url(./art/fish-atlas-crafted-v1.webp)',
            backgroundSize: '400% 300%',
            backgroundPosition: `${(index % 4) * 100 / 3}% ${Math.floor(index / 4) * 50}%`,
            borderRadius: '16%',
        }} />;
}

export default GameIcon;

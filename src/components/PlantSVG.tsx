import type { PlantSVGProps } from "@/types";
import { P } from "@/constants/theme";

/**
 * Renders an individual plant as an SVG.
 * Stage 0 (not done) = bare soil mound.
 * Stage 1 (done)     = full bloom with stem, leaves, and flower.
 */
export function PlantSVG({ plant, done, bursting }: PlantSVGProps) {
  const { petal: pc, stem: sc, leaf: lc, id } = plant;

  const soilBase = (
    <g>
      <ellipse cx="30" cy="75" rx="21" ry="5.5" fill={P.soilDark} opacity=".5" />
      <ellipse cx="30" cy="73" rx="15" ry="3.5" fill={P.soil} opacity=".4" />
    </g>
  );

  if (!done) {
    return (
      <svg viewBox="0 0 60 80" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {soilBase}
      </svg>
    );
  }

  const stemLeaves = (
    <g style={{ animation: "sproutUp .5s ease forwards", transformOrigin: "30px 70px" }}>
      <line x1="30" y1="70" x2="30" y2="38" stroke={sc} strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="19" cy="57" rx="10" ry="4.5" fill={lc} opacity=".82" transform="rotate(-38 19 57)" />
      <ellipse cx="41" cy="50" rx="9"  ry="4"   fill={lc} opacity=".78" transform="rotate(38 41 50)" />
      <ellipse cx="22" cy="45" rx="7"  ry="3.2" fill={lc} opacity=".65" transform="rotate(-20 22 45)" />
    </g>
  );

  const burst = bursting
    ? [...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const d = 28 + Math.random() * 14;
        return (
          <circle
            key={i}
            cx="30"
            cy="25"
            r={2 + Math.random() * 2}
            fill={pc}
            style={{
              ["--tx" as string]: `${Math.cos(a) * d}px`,
              ["--ty" as string]: `${Math.sin(a) * d - 10}px`,
              animation: `petalBurst .75s ease ${i * 0.055}s forwards`,
              transformOrigin: "30px 25px",
            }}
          />
        );
      })
    : null;

  const fa = bursting
    ? { animation: "bloom .65s cubic-bezier(.34,1.56,.64,1) forwards" }
    : {};

  const flowers: Record<number, React.ReactElement> = {
    // Rose — layered circles
    1: (
      <g style={fa}>
        {([[0,0,10],[0,-4,7],[5,2,6],[-5,2,6],[0,6,5],[4,-5,5],[-4,-5,5]] as [number,number,number][]).map(
          ([dx, dy, r], i) => <circle key={i} cx={30+dx} cy={25+dy} r={r} fill={pc} opacity={0.6+i*0.05} />
        )}
        <circle cx="30" cy="25" r="4" fill="#fff0f3" />
      </g>
    ),
    // Peony — dense ruffled petals
    2: (
      <g style={fa}>
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r = 10 + Math.random() * 3;
          return <ellipse key={i} cx={30+r*Math.cos(a)} cy={24+r*Math.sin(a)} rx="6" ry="4.5" fill={pc} opacity=".75"
            transform={`rotate(${a*180/Math.PI} ${30+r*Math.cos(a)} ${24+r*Math.sin(a)})`}/>;
        })}
        <circle cx="30" cy="24" r="6" fill={pc} opacity=".9" />
        <circle cx="30" cy="24" r="3" fill="#fff8f9" />
      </g>
    ),
    // Sweet pea — wing petals
    3: (
      <g style={fa}>
        {([[-10,28,-20],[-5,22,-10],[0,20,0],[5,22,10],[10,28,20]] as [number,number,number][]).map(
          ([dx,dy,r],i) => <ellipse key={i} cx={30+dx} cy={dy} rx="7" ry="5.5" fill={pc} opacity=".78"
            transform={`rotate(${r} ${30+dx} ${dy})`}/>
        )}
        <ellipse cx="30" cy="22" rx="5" ry="7" fill={pc} opacity=".9" />
      </g>
    ),
    // Cherry blossom — 5 notched petals
    4: (
      <g style={fa}>
        {[0,72,144,216,288].map((a,i) => {
          const rad=a*Math.PI/180, px=30+11*Math.cos(rad), py=24+11*Math.sin(rad);
          return <ellipse key={i} cx={px} cy={py} rx="5.5" ry="4" fill={pc} opacity=".85"
            transform={`rotate(${a} ${px} ${py})`}/>;
        })}
        <circle cx="30" cy="24" r="4" fill="#fff0f5" />
        {[0,60,120,180,240,300].map((a,i) => {
          const r=a*Math.PI/180;
          return <line key={i} x1="30" y1="24" x2={30+4*Math.cos(r)} y2={24+4*Math.sin(r)} stroke="#f9a8b8" strokeWidth=".8"/>;
        })}
      </g>
    ),
    // Mint — rounded leaf clusters
    5: (
      <g style={fa}>
        {([[-8,22,-30],[8,20,30],[0,15,0],[-12,32,-45],[12,30,45]] as [number,number,number][]).map(
          ([dx,dy,r],i) => <ellipse key={i} cx={30+dx} cy={dy} rx="11" ry="4.5" fill={pc} opacity=".82"
            transform={`rotate(${r} ${30+dx} ${dy})`}/>
        )}
      </g>
    ),
    // Chamomile — white petals + yellow centre
    6: (
      <g style={fa}>
        {[0,36,72,108,144,180,216,252,288,324].map((a,i) => {
          const rad=a*Math.PI/180;
          return <ellipse key={i} cx={30+12*Math.cos(rad)} cy={24+12*Math.sin(rad)} rx="4.5" ry="3" fill={pc} opacity=".88"
            transform={`rotate(${a} ${30+12*Math.cos(rad)} ${24+12*Math.sin(rad)})`}/>;
        })}
        <circle cx="30" cy="24" r="7" fill="#f5d860" />
        <circle cx="30" cy="24" r="4" fill="#e8c040" />
      </g>
    ),
    // Foxglove — bell spire
    7: (
      <g style={fa}>
        {[0,1,2,3,4,5].map(i => {
          const s = Math.sin(i * 0.6) * 4;
          return <path key={i} d={`M${28+s} ${14+i*9} Q${24+s} ${18+i*9} ${28+s} ${22+i*9} Q${32+s} ${18+i*9} ${28+s} ${14+i*9}`}
            fill={pc} opacity={0.7+i*0.04}/>;
        })}
      </g>
    ),
    // Lavender — small florets up a spike
    9: (
      <g style={fa}>
        {[0,1,2,3,4,5,6].map(i => {
          const s = Math.sin(i * 0.9) * 3;
          return (
            <ellipse key={i} cx={30+s} cy={30-i*5} rx="3.5" ry="2.5"
              fill={pc} opacity={0.65+i*0.05}
              transform={`rotate(${s*8} ${30+s} ${30-i*5})`}/>
          );
        })}
      </g>
    ),
    // Strawberry — white flowers + red berries
    8: (
      <g style={fa}>
        {([[- 8,20],[8,18],[0,14]] as [number,number][]).map(([dx,dy],i) => (
          <g key={i}>
            {[0,72,144,216,288].map((a,j) => (
              <ellipse key={j} cx={30+dx+5*Math.cos(a*Math.PI/180)} cy={dy+5*Math.sin(a*Math.PI/180)}
                rx="3" ry="2.5" fill="#fff8f9" opacity=".9"/>
            ))}
            <circle cx={30+dx} cy={dy} r="2.5" fill="#ffe0e8" />
          </g>
        ))}
        {([[-7,36],[7,34],[0,40]] as [number,number][]).map(([dx,dy],i) => (
          <path key={i} d={`M${30+dx} ${dy-5} Q${26+dx} ${dy+2} ${30+dx} ${dy+5} Q${34+dx} ${dy+2} ${30+dx} ${dy-5}`}
            fill={pc} opacity=".9"/>
        ))}
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 60 80" style={{ width: "100%", height: "100%", overflow: "visible" }}
      className={done ? "sway" : ""}>
      {soilBase}
      {stemLeaves}
      {flowers[id]}
      {burst}
    </svg>
  );
}

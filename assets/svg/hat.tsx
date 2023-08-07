import { motifySvg } from 'moti/svg';
import React, { Component } from 'react';
import Svg, { Defs, G, Path } from 'react-native-svg';

class HatSvg extends Component {
  render() {
    return (
      <Svg width={134} height={61} viewBox="0 0 134 61" fill="none" {...this.props}>
        <G filter="url(#filter0_i_968_615)">
          <Path
            d="M134 30.5C134 47.3447 106.764 61 68.7788 61C30.7933 61 0 47.3447 0 30.5C68.7788 30.5 30.7933 0 68.7788 0C106.764 0 72.3363 30.5 134 30.5Z"
            fill="#8131DB"
          />
        </G>
        <Defs></Defs>
      </Svg>
    );
  }
}

const MotiHat = motifySvg(HatSvg)();
export default MotiHat;

import { AvGadget, AvPanel, AvStandardGrabbable, AvTransform, AvHeadFacingTransform, HighlightType, DefaultLanding, GrabbableStyle, renderAardvarkRoot, AvOrigin, AvInterfaceEntity, AvModel, InterfaceProp, ActiveInterface, InterfaceRole} from '@aardvarkxr/aardvark-react';
import { EAction, EHand, g_builtinModelBox, InitialInterfaceLock, Av, EVolumeType, AvVolume, AvVector } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface VolumeTransforms
{
	leftTopTransform?: AvVector,
	leftBottomTransform?: AvVector,
	rightTopTransform?: AvVector,
	rightBottomTransform?: AvVector,
}

function addVolumeTransforms(transform1: VolumeTransforms, transform2: VolumeTransforms): VolumeTransforms
{
	var finalProduct:VolumeTransforms = 
	{
		leftTopTransform:{
			x: transform1.leftTopTransform.x ?? 0 + transform2.leftTopTransform.x ?? 0, 
			y: transform1.leftTopTransform.y ?? 0 + transform2.leftTopTransform.y ?? 0, 
			z: transform1.leftTopTransform.z ?? 0 + transform2.leftTopTransform.z ?? 0
		},
		leftBottomTransform:{
			x: transform1.leftBottomTransform.x ?? 0 + transform2.leftBottomTransform.x ?? 0, 
			y: transform1.leftBottomTransform.y ?? 0 + transform2.leftBottomTransform.y ?? 0, 
			z: transform1.leftBottomTransform.z ?? 0 + transform2.leftBottomTransform.z ?? 0
		},
		rightTopTransform:{
			x: transform1.rightTopTransform.x ?? 0 + transform2.rightTopTransform.x ?? 0, 
			y: transform1.rightTopTransform.y ?? 0 + transform2.rightTopTransform.y ?? 0, 
			z: transform1.rightTopTransform.z ?? 0 + transform2.rightTopTransform.z ?? 0
		},
		rightBottomTransform:{
			x: transform1.rightBottomTransform.x ?? 0 + transform2.rightBottomTransform.x ?? 0, 
			y: transform1.rightBottomTransform.y ?? 0 + transform2.rightBottomTransform.y ?? 0, 
			z: transform1.rightBottomTransform.z ?? 0 + transform2.rightBottomTransform.z ?? 0
		},
	}
	

	return(finalProduct);
}





interface TransformControlProps
{
	name: string,
	transform: AvVector,
	alterVector: Function,
	delta: number,
	imageUrl: string,
}

class TransformControl extends React.Component<TransformControlProps, {}>
{
	constructor(props)
	{
		super(props);
	}

	public render()
	{
		return(
			<div className = {"TransformControlContainer"}>
				<div className = {"TransformControl"}>
					<div>
						{this.props.name} "x"
						{this.props.transform.x}{/*the functions in the onclick might be running before clicked because theres brackets in there */} 
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: this.props.delta, y: 0,  z: 0}))} className = {"TransformButton"}>up</button>
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: -this.props.delta, y: 0,  z: 0}))} className = {"TransformButton"}>down</button>
					</div>
					<div>
						{this.props.name} "y"
						{this.props.transform.y}
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: 0, y: this.props.delta,  z: 0}))} className = {"TransformButton"}>up</button>
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: 0, y: -this.props.delta,  z: 0}))} className = {"TransformButton"}>down</button>
					</div>
					<div>
						{this.props.name} "z"
						{this.props.transform.z}
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: 0, y: 0,  z: this.props.delta}))} className = {"TransformButton"}>up</button>
						<button onClick = {() => (this.props.alterVector(this.props.transform, {x: 0, y: 0,  z: -this.props.delta}))} className = {"TransformButton"}>down</button>
					</div>
		
				</div>
				<img src = {this.props.imageUrl} className = {"TransformControlImage"}/>
			</div>
		);
	}
}




interface menuProps
{
	isOpen: boolean,
	controllerTransforms: VolumeTransforms,
	setTransform: Function,
	setDelta: Function,
	resetTransforms: Function,
	toggleAxis: Function,

	delta: number,
	

}

class Menu extends React.Component<menuProps, {}>
{
	constructor(props)
	{
		super(props);
	}

	public render()
	{
		if (this.props.isOpen)
		{
			return(
				<>
					<AvTransform translateY = {0.15}>
						<AvPanel interactive={true} widthInMeters={0.2}/>
					</AvTransform>

					<button onClick = {() => (this.props.setDelta(1))} className = {"TransformButton"}>1</button>
					<button onClick = {() => (this.props.setDelta(0.1))} className = {"TransformButton"}>0.1</button>
					<button onClick = {() => (this.props.setDelta(0.05))} className = {"TransformButton"}>0.05</button>
					<button onClick = {() => (this.props.setDelta(0.01))} className = {"TransformButton"}>0.01</button>
					<button onClick = {() => (this.props.setDelta(0.001))} className = {"TransformButton"}>0.001</button>

					<button onClick = {() => (this.props.resetTransforms())} className = {"TransformButton"}>reset</button>

					<button onClick = {() => (this.props.toggleAxis())} className = {"TransformButton"}>toggle axis</button>
					
					<TransformControl name = {"top left"} transform = {this.props.controllerTransforms.leftTopTransform} alterVector = {this.props.setTransform} delta = {this.props.delta} imageUrl = {"./Images/topleft.png"}></TransformControl>
					<TransformControl name = {"lower left"} transform = {this.props.controllerTransforms.leftBottomTransform} alterVector = {this.props.setTransform} delta = {this.props.delta} imageUrl = {"./Images/bottomleft.png"}></TransformControl>
					<TransformControl name = {"top right"} transform = {this.props.controllerTransforms.rightBottomTransform} alterVector = {this.props.setTransform} delta = {this.props.delta} imageUrl = {"./Images/topright.png"}></TransformControl>
					<TransformControl name = {"lower right"} transform = {this.props.controllerTransforms.rightTopTransform} alterVector = {this.props.setTransform} delta = {this.props.delta} imageUrl = {"./Images/bottomright.png"}></TransformControl>
					
				</>
			);
		}
		else
		{
			return(null);
		}
	}
}





interface gadgetState
{
	collideDetectionMain: boolean,
	collideDetectionSecondary: boolean,

	delta: number,

	displayAxis: boolean,
	//controllerTransforms: VolumeTransforms,
}

class MyGadget extends React.Component< {}, gadgetState >
{
	private drawMenu:boolean = true; // we store this outside of state to avoid uncescessary re-renders and a possible infinite loop
	private coolDownCounter: number; // this is just used to cooldown the toggle to stop it triggering too often
	private displayIntro: boolean = true;
	private controllerTransforms:VolumeTransforms;
	//private delta: number; // this is how much the user changes the number by



	constructor( props: any )
	{
		super( props );
		this.state = 
		{ 
			collideDetectionMain: false,
			collideDetectionSecondary: false,
			delta: 0.1,
			displayAxis: true,
		};

		this.controllerTransforms = { // an average default setup for the user to edit
			leftTopTransform: {x: 0, y:-0.13, z:0.13},
			leftBottomTransform: {x: 0, y:-0.24, z:0.23},
			rightTopTransform: {x: 0, y:-0.13, z:0.13},
			rightBottomTransform: {x: 0, y:0, z:0.13},
		}

		//this.delta = 0.1
	}

	@bind
	public setTransform(toChange: AvVector, toChangeBy: AvVector) // we need this because props are read-only
	{
		toChange.x += toChangeBy.x;
		toChange.y += toChangeBy.y;
		toChange.z += toChangeBy.z;

		toChange.x = Number(toChange.x.toFixed(3)); // fix up numbers because janky floating point maths
		toChange.y = Number(toChange.y.toFixed(3));
		toChange.z = Number(toChange.z.toFixed(3));

		this.forceUpdate();
	}

	@bind
	public setDelta(value:number) // used to set delta
	{
		this.setState({delta: value});
	}

	@bind
	public resetTransforms()
	{
		this.controllerTransforms = { // an average default setup for the user to edit
			leftTopTransform: {x: 0, y:-0.13, z:0.13},
			leftBottomTransform: {x: 0, y:-0.24, z:0.23},
			rightTopTransform: {x: 0, y:-0.13, z:0.13},
			rightBottomTransform: {x: 0, y:0, z:0.13},
		}
		this.forceUpdate();
	}

	@bind
	public toggleAxis()
	{
		this.setState({displayAxis: !this.state.displayAxis})
	}

	private updateDrawMenu()
	{
		if(this.state.collideDetectionMain && this.state.collideDetectionSecondary && Date.now() >= this.coolDownCounter + 1000)
		{
			this.drawMenu = !this.drawMenu;
			this.coolDownCounter = Date.now();
			this.displayIntro = false;
		}
	}
	
	@bind
	public collideMain(givenInterface: ActiveInterface) // for volumes at bottom of controllers
	{
		if(givenInterface.role == InterfaceRole.Transmitter) // this function runs twice, once for transmitter and once for reciever, but we only want it to run once, so we only run on transmitters
		{
			givenInterface.onEnded(() => this.setState({collideDetectionMain: false}))
			this.setState({collideDetectionMain: true});
		}
	}

	@bind
	public collideSecondary(givenInterface: ActiveInterface) // for volumes on top and far bottom of controllers
	{
		if(givenInterface.role == InterfaceRole.Transmitter)
		{
			givenInterface.onEnded(() => this.setState({collideDetectionSecondary: false}))
			this.setState({collideDetectionSecondary: true});
		}
	}

	private handVolume:AvVolume =
	{
		type: EVolumeType.Sphere,
		radius: 0.8,
		visualize: true
	};

	private handVolumeLarger:AvVolume =
	{
		type: EVolumeType.Sphere,
		radius: 1.5,
		visualize: true
	};

	private handInterfaceMain:InterfaceProp[] = 
	[{ 
		iface: "OpenMenuMain@1",
		processor: this.collideMain
	}];

	private handInterfaceSecondary:InterfaceProp[] = 
	[{ 
		iface: "OpenMenuSecondary@1",
		processor: this.collideSecondary
	}];

	public render()
	{
		this.updateDrawMenu();
		// THIS SYSTEM CANOT HANDL NUMBSERSDF
		return (
				<div>
					<AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.03 } style={ GrabbableStyle.Gadget }> 

						<Menu 
						isOpen = {this.drawMenu} 
						controllerTransforms = {this.controllerTransforms} 
						setTransform = {this.setTransform} 
						setDelta = {this.setDelta} 
						delta = {this.state.delta} 
						resetTransforms = {this.resetTransforms} 
						toggleAxis = {this.toggleAxis}
						></Menu>


						<AvOrigin path = "/user/hand/left">
							<AvTransform uniformScale = {0.03} transform = {{position: this.controllerTransforms.leftTopTransform}}>
								<AvInterfaceEntity volume = {this.handVolume} transmits = {this.handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>

							<AvTransform uniformScale = {0.03} transform = {{position: this.controllerTransforms.leftBottomTransform}}>
								<AvInterfaceEntity volume = {this.handVolumeLarger} transmits = {this.handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>

							{ this.state.displayAxis &&
							<AvTransform uniformScale = {0.01} translateZ = {0.2} translateY = {-0.07}>
								<AvModel uri = {"models/axis.glb"}/>

								<AvTransform translateY = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterY.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

								<AvTransform translateX = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterX.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

								<AvTransform translateZ = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterZ.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

							</AvTransform>
							}

						</AvOrigin>


						<AvOrigin path = "/user/hand/right">
							<AvTransform uniformScale = {0.03} transform = {{position: this.controllerTransforms.rightTopTransform}}>
								<AvInterfaceEntity volume = {this.handVolume} receives = {this.handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>
							
							<AvTransform uniformScale = {0.03} transform = {{position: this.controllerTransforms.rightBottomTransform}}>
								<AvInterfaceEntity volume = {this.handVolume} receives = {this.handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>

							{ this.state.displayAxis &&
							<AvTransform uniformScale = {0.01} translateZ = {0.2} translateY = {-0.07}>
								<AvModel uri = {"models/axis.glb"}/>

								<AvTransform translateY = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterY.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

								<AvTransform translateX = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterX.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

								<AvTransform translateZ = {3.5}>
									<AvHeadFacingTransform>
										<AvTransform uniformScale = {0.01} rotateY = {-90} > <AvModel uri = {"models/letterZ.glb"}/> </AvTransform>
									</AvHeadFacingTransform>
								</AvTransform>

							</AvTransform>
							}

						</AvOrigin>


					</AvStandardGrabbable>
				</div>			
		);
	}

}

/*
how this works:
We have 2 pairs of volumes, when a pair intersects/connects we set a variable to true, when they disconnect we set it to false. Whenever one of these variables changes the screen redraws, because SetState.
During a redraw we check both volume variables and if both are true then we toggle the menu.

The two volumes are main and secondary, main is a pair of volumes at the bottom of the controllers, secondary volumes are placed on the top of the right controller and quite far below the bottom of the left controller.
Main checks for contact between controllers,
Secondary ensures the two are pointing away from each other, the bigger the lower volume the less exact the angle between the two controllers needs to be

todo:
-mess around with volume positions

use an intro video to walk the user through howto use stufgFD?G
*/
renderAardvarkRoot( "root", <MyGadget/> );

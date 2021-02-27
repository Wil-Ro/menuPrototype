import { AvGadget, AvPanel, AvStandardGrabbable, AvTransform, HighlightType, DefaultLanding, GrabbableStyle, renderAardvarkRoot, AvOrigin, AvInterfaceEntity, AvModel, InterfaceProp, ActiveInterface, InterfaceRole} from '@aardvarkxr/aardvark-react';
import { EAction, EHand, g_builtinModelBox, InitialInterfaceLock, Av, EVolumeType, AvVolume } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface menuProps
{
	isOpen: boolean
}

class Menu extends React.Component<menuProps, {}>
{
	constructor(props)
	{
		super(props)
	}
	public render()
	{
		if (this.props.isOpen)
		{
			return(
					<AvTransform translateY = {0.15}>
						<AvPanel interactive={true} widthInMeters={ 0.2 }/>
					</AvTransform>
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
}

class MyGadget extends React.Component< {}, gadgetState >
{
	private drawMenu:boolean; // we store this outside of state to avoid uncescessary re-renders and a possible infinite loop
	constructor( props: any )
	{
		super( props );
		this.state = 
		{ 
			collideDetectionMain: false,
			collideDetectionSecondary: false,
		};
	}

	private updateDrawMenu()
	{
		if(this.state.collideDetectionMain && this.state.collideDetectionSecondary)		
			this.drawMenu = !this.drawMenu
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

	public render()
	{
		var handVolume:AvVolume =
		{
			type: EVolumeType.Sphere,
			radius: 0.8,
			visualize: false
		};

		var handVolumeLarger:AvVolume =
		{
			type: EVolumeType.Sphere,
			radius: 1.5,
			visualize: false
		};

		var handInterfaceMain:InterfaceProp[] = 
		[{ 
			iface: "OpenMenuMain@1",
			processor: this.collideMain
		}];

		var handInterfaceSecondary:InterfaceProp[] = 
		[{ 
			iface: "OpenMenuSecondary@1",
			processor: this.collideSecondary
		}];

		this.updateDrawMenu();


		return (
				<div>
					<AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.03 } style={ GrabbableStyle.Gadget }>

						<Menu isOpen = {this.drawMenu}></Menu>


						<AvOrigin path = "/user/hand/left">
							<AvTransform uniformScale = {0.03} translateY = {-0.13} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} transmits = {handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>

							<AvTransform uniformScale = {0.03} translateY = {-0.24} translateZ = {0.23}>
								<AvInterfaceEntity volume = {handVolumeLarger} transmits = {handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>
						</AvOrigin>


						<AvOrigin path = "/user/hand/right">
							<AvTransform uniformScale = {0.03} translateY = {-0.13} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} receives = {handInterfaceMain}></AvInterfaceEntity>
							</AvTransform>
							
							<AvTransform uniformScale = {0.03} translateZ = {0.13}>
								<AvInterfaceEntity volume = {handVolume} receives = {handInterfaceSecondary}></AvInterfaceEntity>
							</AvTransform>
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
*/
renderAardvarkRoot( "root", <MyGadget/> );

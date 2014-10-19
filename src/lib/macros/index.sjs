macro ambBlock {
  rule {
    { $e:expr ; }
  } => {
    ( $e )
  }
  rule {
    { var $a:ident = $e:expr ; $es ... }
  } => {
    ( $e ) . bind ( function ( $a ) { return ambBlock { $es ... } ; } )
  }
  rule {
    { $e:expr ; $es ... }
  } => { 
    ( $e ) . bind ( function () { return ambBlock { $es ... } ;  } ) 
  }
}

export ambBlock;